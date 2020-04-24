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
        this.chatHeader = null;
        this.chatBody = null;
        this.chatFooter = null;
    }

    get chatHeaderDiv() {
        this.setDOMElements();
        return this.chatHeader;
    }

    get chatBodyDiv() {
        this.setDOMElements();
        return this.chatBody;
    }

    get chatFooterDiv() {
        this.setDOMElements();
        return this.chatFooter;
    }

    render() {
        super.render();
        this.#adjustColumns();
        makeEmpty(this.mainColumn);
        this.mainColumn.insertAdjacentHTML('afterbegin', chatTemplate({active: false}));
        (async () => {this.#setDOMChatElements();})();
    }

    #adjustColumns() {
        this.setDOMElements();
        this.leftColumn.className = 'my__left-column-body my__left-column-body_page-chat';
        this.mainColumn.className = 'my__main-column chat';
    }

    #setDOMChatElements() {
        this.setDOMElements();
        while (this.chatHeader === null) {
            this.chatHeader = this.mainColumn.querySelector('.chat__header');
        }
        while (this.chatBody === null) {
            this.chatBody = this.mainColumn.querySelector('.chat__body');
        }
        while (this.chatFooter === null) {
            this.chatFooter = this.mainColumn.querySelector('.chat__footer');
        }
    }

    async showCenterError(error) {
        this.setDOMElements();
        await this.showServerError(this.chatBody, error);
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
                uid:    0,
                time:   'вчера',
                last_message: 'Последнее сообщение, которое было не так давно',
                unread:  false,
            },
            {
                avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/users/59059926-e98f-4e38-a44f-62b359df8351.jpg',
                name:   'Апполинария',
                uid:    1,
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
                uid:    chat.uid,
                time:   chat.time,
                last_message:   chat.last_message,
                unread: chat.unread,
            }));
        });
    }

    async renderChatLoading(title) {
        this.setDOMElements();
        makeEmpty(this.chatBody);
        // Render main areas such as chat screen and footer

        this.#setDOMChatElements();
        (async () => {this.showLoading(this.chatBody);})();
        (async () => {this.#activateUI(title);})();
    }

    #activateUI = (title) => {
        this.chatHeader.classList.add('chat__header_active');
        this.chatHeader.querySelector('h2').innerText = title;
        this.chatFooter.classList.add('chat__footer_active');
    }
}