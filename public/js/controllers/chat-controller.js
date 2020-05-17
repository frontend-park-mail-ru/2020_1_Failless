'use strict';

import ChatModel from 'Eventum/models/chat-model';
import ChatView from 'Eventum/views/chat-view';
import Controller from 'Eventum/core/controller';
import Router from 'Eventum/core/router';
import UserModel from 'Eventum/models/user-model';
import {resizeTextArea} from 'Eventum/utils/basic';
import {toggleChatOnMobile} from 'Blocks/chat/chat';
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
        this.chat_id = null;
        this.ChatModel = ChatModel.instance;
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    action() {
        super.action();
        this.view.render();
        UserModel.getLogin()
            .then(user => {
                if (user) {
                    this.ChatModel.getChats({uid: user.uid, limit: 10, page: 0})
                        .then(chats => {
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
                                this.ChatModel.establishConnection(user.uid, this.receiveMessage)
                                    .then(response => {
                                        this.ChatModel.chats = chats;
                                        this.view.renderChatList();
                                    });
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
                }})
            .catch(error => this.view.showCenterError(error).then());

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
        this.ChatModel.chats.forEach((chat, chatId) => {
            if (chatId === Number(chatListItem.getAttribute('data-cid'))){
                chat.active = true;
                return;
            }
            if (chat.active) {
                chat.active = false;
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
        let id = 0;
        UserModel.getProfile()
            .then(profile => {
                id = profile.uid;
                return this.ChatModel.getLastMessages(profile.uid, chatId, 30);})
            .then((messages) => {
                this.view.activateChatUI(name).then();
                // Append necessary fields
                messages.forEach((message) => {
                    message.side = message.uid === id ? 'right' : 'left';
                    message.new = false;
                    message.body = message.message;
                });
                this.view.renderLastMessages(messages.reverse());})
            .catch(error => this.view.showCenterError(error));
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
        this.ChatModel.chats.forEach((chat) => {
            if (chat.active === true) {
                chat_id = chat.chat_id;
            }
        });

        UserModel.getProfile()
            .then(profile => this.ChatModel.sendMessage({uid: profile.uid, message: message, chat_id: chat_id}))
            .catch(console.error);
        textarea.value = '';
        resizeTextArea.call(textarea);
    };

    receiveMessage = (event) => {
        // Find active chat
        let activeChatId = 0;
        for (let [chatId, chat] of this.ChatModel.chats) {
            if (chat.active) {
                activeChatId = chatId;
                break;
            }
        }

        // Check where to insert the message
        let message = JSON.parse(event.data);
        if (activeChatId && message.chat_id === activeChatId) {
            UserModel.getProfile()
                .then(profile => {
                    this.view.updateLastMessage(message, profile.uid === message.uid);
                    this.view.renderMessage({
                        body: message.message,
                        side: profile.uid === message.uid ? 'right' : 'left',
                        new: true,
                    });})
                .catch(console.error);
        }
    }
}