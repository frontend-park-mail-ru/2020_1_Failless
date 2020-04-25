'use strict';

import MyView from 'Eventum/views/my-view.js';
import {makeEmpty} from 'Eventum/utils/basic.js';
import chatListItemTemplate from 'Blocks/chat-list-item/template.hbs';
import chatTemplate from 'Blocks/chat/template.hbs';
import errorTemplate from 'Blocks/error/template.hbs';
import chatMessageTemplate from 'Blocks/chat-message/template.hbs';
import {icons} from 'Eventum/utils/static-data.js';
import {images} from 'Eventum/utils/static-data';
import {scrollChatDown} from 'Blocks/chat/chat';
import {showMessage} from 'Blocks/chat-message/chat-message';

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

    /**
     * Check if elements are set and return div of chatBody
     * @return {HTMLElement}
     */
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
        this.mainColumn.insertAdjacentHTML('afterbegin', chatTemplate({
            active: false,
            motivator: {
                icon: icons.get('finger-left'),
                message: 'Выберите чат слева',
            },
        }));
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

    async renderEmptyList() {
        this.setDOMElements();
        makeEmpty(this.chatBody);
        this.chatBody.insertAdjacentHTML('afterbegin', errorTemplate({
            icon:       icons.get('sad'),
            message:    'На горизонте тихо...',
            button:     'Искать!'
        }));
    }

    async showCenterError(error) {
        this.setDOMElements();
        this.#disableChatUI();
        this.showServerError(this.chatBody, error);
    }

    async showLeftError(error) {
        this.setDOMElements();
        await this.#disableChatUI();
        await this.showServerError(this.leftColumn, error);
    }

    /**
     * This function depends on non-empty chats
     * so check it somewhere outside
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
        this.leftColumn.insertAdjacentHTML('afterbegin', '<h3 style="padding: 0 15px;">Диалоги</h3>');
        chats.forEach((chat) => {
            if (!chat.avatar) {
                chat.avatar = images.get('user-default');
            }
            if (!chat.last_message) {
                chat.last_message = 'Отправьте первое сообщение!';
                chat.unread = true;
                chat.time = null;
            }
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

    /**
     * Show all chat elements
     * but keep header and footer invisible
     * and main area contain loading animation
     * @param title
     * @return {Promise<void>}
     */
    async renderChatLoading(title) {
        this.setDOMElements();
        makeEmpty(this.chatBody);
        this.#setDOMChatElements();
        this.chatHeader.querySelector('h2').innerText = title;
        this.showLoading(this.chatBody);
    }

    /**
     * On initial render all chat elements (header, footer)
     * ARE on the screen but invisible
     * so this function makes them appear
     */
    async #enableChatUI() {
        this.chatHeader.classList.add('chat__header_active');
        this.chatFooter.classList.add('chat__footer_active');
    }

    async #disableChatUI() {
        this.chatHeader.classList.remove('chat__header_active');
        this.chatFooter.classList.remove('chat__footer_active');
    }

    async activateChatUI(title) {
        this.#enableChatUI();
        this.chatHeader.querySelector('h2').innerText = title;
    }

    /**
     * Render messages
     * @param {Array<{
     *      id: Number,
     *      body: String,
     *      own: boolean,
     *      new: boolean,
 *      }>} messages
     */
    renderLastMessages(messages) {
        (async () => {this.#enableChatUI();})();
        const chatBody = this.chatBodyDiv;
        if (chatBody.firstElementChild.className === 'spinner' || chatBody.firstElementChild.className === 'error') {
            makeEmpty(chatBody);
        }
        if (!messages) {
            messages = [
                {
                    id: 1,
                    body: 'MORNING FUCKERS!',
                    own: false,
                    new: false,
                },
                {
                    id: 2,
                    body: 'GOOD MORNING TO YA LADIES!',
                    own: true,
                    new: false,
                },
                {
                    id: 1,
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est…',
                    own: false,
                    new: false,
                },
            ];
        }
        messages.forEach((message) => {
            chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}))
        });
        messages.forEach((message) => {
            chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}))
        });
        messages.forEach((message) => {
            chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}))
        });
        scrollChatDown(chatBody);
    }

    /**
     * Render one particular message
     * @param {{
     *      id: String,
     *      body: String,
     *      own: boolean,
     *      new: boolean}} message
     */
    renderMessage(message) {
        const chatBody = this.chatBodyDiv;
        chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}));
        scrollChatDown(chatBody);
        showMessage(chatBody.lastElementChild);
    }
}