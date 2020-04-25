'use strict';

import ChatView from 'Eventum/views/chat-view.js';
import UserModel from 'Eventum/models/user-model.js';
import {setChatListItemAsRead, toggleChatListItemActive} from 'Blocks/chat-list-item/chat-list-item.js';
import Router from 'Eventum/core/router';
import ChatModel from 'Eventum/models/chat-model';
import {resizeTextArea} from 'Blocks/chat/chat';
import Controller from 'Eventum/core/controller';

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
                UserModel.getChats().then(
                    (chats) => {
                        if (!chats || chats.length === 0) {
                            this.view.renderEmptyList().then(() => {
                                this.addEventHandler(
                                    this.view.chatBodyDiv.querySelector('button'),
                                    'click',
                                    () => {
                                        Router.redirectForward('/feed');
                                    }
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
            this.view.leftColumn,
            'click',
            this.#activateChatListItem
        );
        this.addEventHandler(
            this.view.chatFooter.querySelector('.chat__button'),
            'click',
            this.#sendMessage
        );
        this.addEventHandler(
            this.view.chatFooter.querySelector('textarea'),
            'input',
            resizeTextArea,
        );
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
    }

    /**
     * Handle click on chat list item
     *  deactivate previous if exists and activate current
     * @param event
     */
    #activateChatListItem = (event) => {
        event.preventDefault();
        const chatListItem = event.target.closest('.chat-list-item');
        const previousChatListItem = this.view.leftColumn.querySelector('.chat-list-item_active');
        if (previousChatListItem && chatListItem.getAttribute('data-uid') === previousChatListItem.getAttribute('data-uid')) {
            return;
        }
        if (previousChatListItem) {
            toggleChatListItemActive(previousChatListItem).then();
        }
        setChatListItemAsRead(chatListItem).then();
        toggleChatListItemActive(chatListItem).then();
        this.#handleChatOpening(
            chatListItem.getAttribute('data-uid'),
            chatListItem.querySelector('.chat-list-item__title').innerText);
    };

    /**
     * Send message to chat
     * @param event
     */
    #sendMessage = (event) => {
        let message = event.target.previousElementSibling.value;
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
        event.target.previousElementSibling.value = '';
        resizeTextArea.call(event.target.previousElementSibling);
    };

    /**
     * Open new WS chat on click on chat in the list
     * @param {String} id2
     * @param {String} name
     */
    #handleChatOpening = (id2, name) => {
        // async Render
        // Open websocket connection
        // async Get latest messages
        this.view.renderChatLoading(name).then();

        ChatModel.openChat(id2).then((socket) => {
            if (socket !== undefined) { // TODO: couldn't catch reject for some reason
                this.socket = socket;
                UserModel.getProfile().then((profile) => {
                    ChatModel.getLastMessages(profile.uid, id2, 30).then(
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
                // this.view.renderLastMessages();
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