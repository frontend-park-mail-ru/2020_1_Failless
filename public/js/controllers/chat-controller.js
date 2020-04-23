'use strict';

import MyController from 'Eventum/controllers/my-controller.js';
import ChatView from 'Eventum/views/chat-view.js';
import UserModel from 'Eventum/models/user-model.js';

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
    }
}