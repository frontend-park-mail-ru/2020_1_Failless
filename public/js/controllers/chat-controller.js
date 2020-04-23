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
                // UserModel.getChats().then();
                console.log(profile);
            },
            (error) => {
                (async () => {await this.view.showCenterError(error);})();
                console.error(error);
            }
        );
    }
}