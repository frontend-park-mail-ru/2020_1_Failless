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
            (event) => {
                event.preventDefault();
                const chatListItem = event.target.closest('.chat-list-item');
                setChatListItemAsRead(chatListItem);
                toggleChatListItemActive(chatListItem);
                this.#handleChatOpening(
                    chatListItem.getAttribute('data-uid'),
                    chatListItem.querySelector('.chat-list-item__title').innerText);
            });
        this.addEventHandler(
            // TODO: render main area but make it invisible
            this.view.getMainColumn()
        )
    }


    #handleChatOpening = (uid, name) => {
        // Async render
        this.view.renderChatLoading(name).then();

        // Open websocket connection
        // Get latest messages
    }
}