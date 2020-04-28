'use strict';

import ChatModel from 'Eventum/models/chat-model';
import ChatView from 'Eventum/views/chat-view';
import Controller from 'Eventum/core/controller';
import Router from 'Eventum/core/router';
import UserModel from 'Eventum/models/user-model';
import {resizeTextArea, toggleChatOnMobile} from 'Blocks/chat/chat';
import {setChatListItemAsRead, toggleChatListItemActive} from 'Blocks/chat-list-item/chat-list-item';
import {detectMobile} from 'Eventum/utils/basic';

/**
 * @class ChatController
 */
export default class ChatController extends Controller {
    constructor(parent) {
        super(parent);
        this.view = new ChatView(parent);
        this.uid = null;
        this.socket = null;
    }

    action() {
        super.action();
        this.view.render();
        UserModel.getProfile().then(
            (profile) => {
                if (!profile) {
                    console.error('Server error');
                    console.log(profile);
                    return;
                }
                UserModel.getChats({uid: profile.uid, limit: 10, page: 0}).then(
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
                            return;
                        }
                        this.view.renderChatList(chats).then();
                    },
                    (error) => {
                        this.view.showLeftError(error).then();
                        this.view.showCenterError(error).then();
                        console.error(error);
                    });
                this.uid = profile.uid;
            },
            (error) => {
                this.view.showCenterError(error).then();
                console.error(error);
            }
        );

        // Adding event handlers
        this.view.setDOMChatElements(); // do it once instead of calling getters and checking there
        this.addEventHandler(
            this.view.chatListBody, 'click',
            this.#activateChatListItem
        );
        this.addEventHandler(
            this.view.chatFooter.querySelector('.chat__button'), 'click',
            (event) => {
                this.#sendMessage(event.target.previousElementSibling);
            }
        );
        this.addEventHandler(   // For mobile
            this.view.chatFooter.querySelector('.chat__send-icon'), 'click',
            (event) => {
                if (event.target.matches('path')) {
                    this.#sendMessage(event.target.parentElement.parentElement.parentElement.querySelector('textarea'));
                } else {
                    this.#sendMessage(event.target.parentElement.parentElement.querySelector('textarea'));
                }
            },
        );
        const textInput = this.view.chatFooter.querySelector('textarea');
        this.addEventHandler(textInput, 'input', resizeTextArea);
        this.addEventHandler(textInput, 'keydown', (event) => {
            if (event.keyCode === 13) {this.#sendMessage(event);}
        });
        // TODO: redirect error here
        this.addEventHandler(
            this.view.circleHeader,
            'click',
            (event) => {
                event.preventDefault();
                let circle = null;
                if (event.target.matches('.circle')) {
                    circle = event.target;
                } else if (event.target.matches('#icon') || event.target.matches('path')) {
                    circle = event.target.closest('.circle');
                } else {
                    return;
                }
                Router.redirectForward(circle.getAttribute('data-circle-href'));
            },
        );
        // On mobile: close chat + deactivate chatListItem
        this.addEventHandler(
            this.view.chatHeader.querySelector('.chat__return-icon'),
            'click',
            () => {
                toggleChatListItemActive(this.view.chatListBody.querySelector('.chat-list-item_active')).then();
                toggleChatOnMobile.call(this.view.mainColumn);
            });
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
    };

    /**
     * Send message to chat
     * @param {HTMLTextAreaElement} input
     */
    #sendMessage = (input) => {
        let message = input.value;
        if (!message) {
            return;
        }
        // Send message via WebSocket
        (async () => {this.socket.send({uid: this.uid, message});})();
        this.view.renderMessage({
            id: this.uid,
            body: message,
            own: true,
            new: true,
        });
        input.value = '';
        resizeTextArea.call(input);
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

        ChatModel.openChat(chatId).then((socket) => {
            if (socket !== undefined) { // TODO: couldn't catch reject for some reason
                this.socket = socket;
                UserModel.getProfile().then((profile) => {
                    ChatModel.getLastMessages(profile.uid, chatId, 30).then(
                        (messages) => {
                            this.view.activateChatUI(name).then();
                            // Append necessary fields
                            messages.forEach((message) => {
                                message.own = message.uid === this.uid;
                                message.new = false;
                            });
                            this.view.renderLastMessages(messages);
                        },
                        (error) => {
                            this.view.showCenterError(error).then();
                        });
                });
                this.#chat();
            } else {
                this.view.showCenterError('Failed to establish a connection').then();
            }});
    };

    /**
     * Chat here
     */
    #chat = () => {
        this.socket.onmessage = (message) => {
            console.log(message);
            console.log(message.data);
            message.data.own = message.data.uid === this.uid;
            message.data.new = true;
            this.view.renderMessage(message.data);
        };
    };
}