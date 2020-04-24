'use strict';

import MyView from 'Eventum/views/my-view.js';
import {makeEmpty} from 'Eventum/utils/basic';
import chatListItemTemplate from 'Blocks/chat-list-item/template.hbs';
import chatTemplate from 'Blocks/chat/template.hbs';

/**
 * @class create ChatView class
 */
export default class ChatView extends MyView {
    constructor(parent) {
        super(parent);
        this.parent = parent;
        this.chatBody = null;
    }

    render() {
        super.render();
        this.#adjustColumns().then();
    }

    async #adjustColumns() {
        this.setDOMElements();
        this.leftColumn.className = 'my__left-column-body my__left-column-body_page-chat';
        this.mainColumn.className = 'my__main-column chat';
    }

    async showCenterError(error) {
        this.setDOMElements();
        await this.showServerError(this.mainColumn, error);
    }

    async showLeftError(error) {
        this.setDOMElements();
        await this.showServerError(this.leftColumn, error);
    }

    /**
     *
     * @param chats[{
     *     name: String,
     *     time: String,
     *     avatar: String,
     *     last_message: String,
     * }]
     * @return {Promise<void>}
     */
    async renderChatList(chats) {
        makeEmpty(this.leftColumn);
        // if (!chats) {
        //     this.showLeftError(chats);
        // }
        chats = [
            {
                avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/users/59059926-e98f-4e38-a44f-62b359df8351.jpg',
                name:   'Егор',
                time:   'вчера',
                last_message: 'Последнее сообщение, которое было не так давно',
                unread:  false,
            },
            {
                avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/users/59059926-e98f-4e38-a44f-62b359df8351.jpg',
                name:   'Апполинария',
                time:   'позавчера',
                last_message: 'Последнее сообщение, которое было не так давно. Последнее сообщение, которое было не так давно',
                unread: true,
            },
        ];
        this.leftColumn.insertAdjacentHTML('afterbegin', '<h3 style="padding: 0 15px;">Диалоги</h3>');
        chats.forEach((chat) => {
            this.leftColumn.insertAdjacentHTML('beforeend', chatListItemTemplate({
                avatar: chat.avatar,
                name:   chat.name,
                time:   chat.time,
                last_message:   chat.last_message,
                unread: chat.unread,
            }));
        });
    }

    async renderChatLoading(title) {
        makeEmpty(this.mainColumn);
        // Render main areas such as chat screen and footer
        this.mainColumn.insertAdjacentHTML('afterbegin', chatTemplate({title: title}));
        this.chatBody = this.mainColumn.querySelector('.chat__body');

        this.showLoading(this.chatBody);
    }

}