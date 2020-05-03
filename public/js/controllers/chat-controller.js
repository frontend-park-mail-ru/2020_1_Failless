'use strict';

import ChatModel from 'Eventum/models/chat-model';
import ChatView from 'Eventum/views/chat-view';
import Controller from 'Eventum/core/controller';
import Router from 'Eventum/core/router';
import UserModel from 'Eventum/models/user-model';
import {resizeTextArea, toggleChatOnMobile} from 'Blocks/chat/chat';
import {setChatListItemAsRead, toggleChatListItemActive} from 'Blocks/chat-list-item/chat-list-item';
import {detectMobile} from 'Eventum/utils/basic';
import {CircleRedirect} from 'Blocks/circle/circle';

/**
 * @class ChatController
 */
export default class ChatController extends Controller {
    constructor(parent) {
        super(parent);
        this.view = new ChatView(parent);
        this.uid = null;
        this.chat_id = null;
        this.ChatModel = null;
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    action() {
        super.action();
        this.view.render();
        UserModel.getProfile().then(
            (profile) => {
                if (profile) {
                    this.uid = profile.uid;
                    this.ChatModel = new ChatModel();
                    ChatModel.getChats({uid: this.uid, limit: 10, page: 0}).then(
                        (chats) => {
                            console.log(chats);
                            if (!chats || chats.length === 0) {
                                const errorArea = detectMobile() ? this.view.chatListBodyDiv : this.view.chatBodyDiv;
                                this.view.renderEmptyList(errorArea).then(() => {
                                    this.addEventHandler(
                                        errorArea.querySelector('button'),
                                        'click',
                                        () => {Router.redirectForward('/feed');}
                                    );
                                });
                            } else if (Object.prototype.hasOwnProperty.call(chats, 'message')) {
                                this.view.showLeftError(chats.message);
                            } else {
                                this.ChatModel.establishConnection(profile.uid, this.receiveMessage).then(
                                    (response) => {
                                        console.log(response);
                                        this.ChatModel.chats = chats;
                                        // после загрузки все чаты неактивны
                                        this.ChatModel.chats.forEach((val) => {
                                            Object.assign(val, {active: false});
                                        });
                                        this.view.renderChatList(chats).then();
                                    }
                                );
                            }
                        },
                        (error) => {
                            this.view.showLeftError(error).then();
                            this.view.showCenterError(error).then();
                            console.error(error);
                            this.ChatModel.socket.close();
                        });
                } else {
                    this.view.showCenterError('No profile?!').then();
                }
            },
            (error) => {
                this.view.showCenterError(error).then();
            }
        );

        this.view.setDOMChatElements(); // do it once instead of calling getters and checking there
        this.initHandlers([
            {
                attr: 'circleRedirect',
                events: [
                    {type: 'click', handler: CircleRedirect},
                ]
            },
            {
                attr: 'activateChatListItem',
                events: [
                    {type: 'click', handler: this.#activateChatListItem},
                ]
            },
            {
                attr: 'sendMessageOnClick',
                many: true,
                events: [
                    {type: 'click', handler: this.#sendMessage},
                ]
            },
            {
                attr: 'messageInput',
                events: [
                    {type: 'input', handler: resizeTextArea},
                    {type: 'keydown', handler: (event) => {
                        if (event.code === 'Enter') {
                            event.preventDefault();
                            this.#sendMessage();
                        }
                    }},
                ]
            },
            {   // mobile only
                attr: 'toggleMobileChat',
                events: [
                    {type: 'click', handler: () => {
                        toggleChatListItemActive(this.view.chatListBody.querySelector('.chat-list-item_active')).then();
                        toggleChatOnMobile.call(this.view.mainColumn);
                    }},
                ]
            },
        ]);
    }

    /**
     * Handle click on chat list item
     *  deactivate previous if exists and activate current
     * @param event
     */
    #activateChatListItem = (event) => {
        event.preventDefault();
        if (event.target.matches('button')) {   // for some reason clicking on 'Искать' button
            return;                             // on error message when the list is empty (mobile only)
        }                                       // triggers this (i hope it's not a footgun)
        const chatListItem = event.target.closest('.chat-list-item');
        const previousChatListItem = this.view.leftColumn.querySelector('.chat-list-item_active');
        if (previousChatListItem && chatListItem.getAttribute('data-cid') === previousChatListItem.getAttribute('data-cid')) {
            return;
        }
        if (previousChatListItem) {
            toggleChatListItemActive(previousChatListItem).then();
        }
        setChatListItemAsRead(chatListItem).then();
        toggleChatListItemActive(chatListItem).then();
        this.#handleChatOpening(
            chatListItem.getAttribute('data-cid'),
            chatListItem.querySelector('.chat-list-item__title').innerText);
        // Но один из чатов становится активным, а другой неактивыным
        this.ChatModel.chats.forEach((val) => {
            if (val.chat_id === Number(chatListItem.getAttribute('data-cid'))){
                val.active = true;
                return;
            }
            if (val.active) {
                val.active = false;
            }
        });
    };

    /**
     * Open new WS chat on click on chat in the list
     * @param {String} chatId
     * @param {String} name
     */
    #handleChatOpening = (chatId, name) => {
        // async Render
        // Open websocket connection
        // async Get latest messages
        this.view.renderChatLoading(name).then();
        toggleChatOnMobile.call(this.view.mainColumnDiv);

        if (!this.uid) {
            this.view.showCenterError('No profile').then();
            return;
        }
        ChatModel.getLastMessages(this.uid, chatId, 30).then(
            (messages) => {
                this.view.activateChatUI(name).then();
                // Append necessary fields
                messages.forEach((message) => {
                    message.own = message.uid === this.uid;
                    message.new = false;
                    message.body = message.message;
                });
                this.view.renderLastMessages(messages.reverse());
            },
            (error) => {
                this.view.showCenterError(error).then();
            });
    };

    /***********************************************
                        Chat part
     ***********************************************/

    /**
     * Send message to chat
     */
    #sendMessage = () => {
        let textarea = this.view.chatFooterDiv.querySelector('textarea');

        const message = textarea.value;
        if (!message) {
            return;
        }
        // Send message via WebSocket
        let chat_id = -1;
        // Ищем активный чат
        this.ChatModel.chats.forEach((val) => {
            if (val.active === true) {
                chat_id = val.chat_id;
            }
        });

        (async () => {this.ChatModel.socket.send(JSON.stringify({uid: this.uid, message: message, chat_id: chat_id}));})();
        textarea.value = '';
        resizeTextArea.call(textarea);
    };

    receiveMessage = (event) => {
        // Find active chat
        let activeChat = this.ChatModel.chats.find((chat) => {
            return chat.active;
        });

        // Check where to insert the message
        let message = JSON.parse(event.data);
        if (activeChat && message.chat_id === activeChat.chat_id) {
            this.view.renderMessage({
                body: message.message,
                own: this.uid === message.uid,
                new: true,
            });
        } else {
            this.view.updateLastMessage(message).then();
        }
    }
}