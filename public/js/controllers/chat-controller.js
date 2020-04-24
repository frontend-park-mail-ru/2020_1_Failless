'use strict';

import MyController from 'Eventum/controllers/my-controller.js';
import ChatView from 'Eventum/views/chat-view.js';
import UserModel from 'Eventum/models/user-model.js';
import {setChatListItemAsRead, toggleChatListItemActive} from 'Blocks/chat-list-item/chat-list-item.js';

/**
 * @class ChatController
 */
export default class ChatController extends MyController {
    constructor(parent) {
        super(parent);
        this.view = new ChatView(parent);
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
                        this.view.renderChatList(chats).then();
                    },
                    (error) => {
                        this.view.showLeftError(error).then();
                        this.view.renderChatList().then();
                        this.view.showCenterError(error).then();
                        console.error(error);
                    });
                // TODO: do sth else
            },
            (error) => {
                (async () => {await this.view.showCenterError(error);})();
                console.error(error);
            }
        );

        // Adding event handlers
        this.addEventHandler(
            this.view.getLeftColumn(),
            'click',
            this.#activateChatListItem
        );
        this.addEventHandler(
            this.view.chatFooter.querySelector('.chat__button'),
            'click',
            this.#sendMessage
        );
    }

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

    #sendMessage = (event) => {
        console.log(event.target.closest('.chat__input'));
        alert('Sending message');
    };

    #handleChatOpening = (uid, name) => {
        // Async render
        this.view.renderChatLoading(name).then();

        // Open websocket connection
        // Get latest messages
    }
}