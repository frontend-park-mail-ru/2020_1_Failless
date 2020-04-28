'use strict';

import chatListTemplate from 'Blocks/chat-list/template.hbs';
import chatListItemTemplate from 'Blocks/chat-list-item/template.hbs';
import chatMessageTemplate from 'Blocks/chat-message/template.hbs';
import chatTemplate from 'Blocks/chat/template.hbs';
import errorTemplate from 'Blocks/error/template.hbs';
import MyView from 'Eventum/views/my-view';
import {icons} from 'Eventum/utils/static-data';
import {images} from 'Eventum/utils/static-data';
import {makeEmpty} from 'Eventum/utils/basic';
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
        this.chatListBody = null;
    }

    /**
     * Check if elements are set and return div of chatHeader
     * @return {HTMLElement}
     */
    get chatHeaderDiv() {
        this.setDOMChatElements();
        return this.chatHeader;
    }

    /**
     * Check if elements are set and return div of chatBody
     * @return {HTMLElement}
     */
    get chatBodyDiv() {
        this.setDOMChatElements();
        return this.chatBody;
    }

    /**
     * Check if elements are set and return div of chatFooter
     * @return {HTMLElement}
     */
    get chatFooterDiv() {
        this.setDOMChatElements();
        return this.chatFooter;
    }

    /**
     * Check if elements are set and return div of chatListBody
     * @return {HTMLElement}
     */
    get chatListBodyDiv() {
        this.setDOMChatElements();
        return this.chatListBody;
    }

    render() {
        super.render();
        this.#adjustColumns();
        (async () => {this.leftHeaderDiv.querySelectorAll('.circle')[0].classList.add('circle_active');})();
        makeEmpty(this.mainColumn);
        this.mainColumn.insertAdjacentHTML('afterbegin', chatTemplate({
            active: false,
            motivator: {
                icon: icons.get('finger-left'),
                message: 'Выберите чат слева',
            },
            send_icon: icons.get('arrow-up'),
            return_icon: icons.get('arrow-left'),
            more_icon: icons.get('dots'),
        }));
        makeEmpty(this.leftColumn);
        this.leftColumn.insertAdjacentHTML('afterbegin', chatListTemplate({
            icon: icons.get('finger-up'),
            message: 'Будьте осторожны при разговоре с незнакомцами',
        }));
        (async () => {this.setDOMChatElements();})();
    }

    /**
     * Classes of columns in basic template are awful
     * so this one appends chat classes and fixes sth
     */
    #adjustColumns() {
        this.setDOMElements();
        this.leftColumn.className = 'my__left-column-body my__left-column-body_page-chat';
        this.mainColumn.className = 'my__main-column chat';
    }

    /**
     * Find this.* DOM elements
     */
    setDOMChatElements() {
        this.setDOMElements();
        while (!this.chatHeader) {
            this.chatHeader = this.mainColumn.querySelector('.chat__header');
        }
        while (!this.chatBody) {
            this.chatBody = this.mainColumn.querySelector('.chat__body');
        }
        while (!this.chatFooter) {
            this.chatFooter = this.mainColumn.querySelector('.chat__footer');
        }
        while (!this.chatListBody) {
            this.chatListBody = this.leftColumn.querySelector('.chat-list__body');
        }
    }

    /**
     * If user has no chats - show him motivational error
     * @param {Element} errorArea - since we render error
     *  in main div on big screens and in chatlist area on mobiles
     * @return {Promise<void>}
     */
    async renderEmptyList(errorArea) {
        makeEmpty(errorArea);
        errorArea.insertAdjacentHTML('afterbegin', errorTemplate({
            icon:       icons.get('sad'),
            message:    'На горизонте тихо...',
            button:     'Искать!'
        }));
    }

    /**
     * Show error in central column
     * @param {string} error
     * @return {Promise<void>}
     */
    async showCenterError(error) {
        this.setDOMElements();
        this.#disableChatUI();
        this.showError(this.chatBody, error, 'warning', null);
    }

    /**
     * Show error in left column
     * @param {Error} error
     * @return {Promise<void>}
     */
    async showLeftError(error) {
        await this.#disableChatUI();
        await this.showError(this.leftColumn, error, 'warning', null);
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
        const chatBody = this.chatListBody;
        makeEmpty(chatBody);
        chats.forEach((chat) => {
            if (!chat.avatar) {
                chat.avatar = images.get('user-default');
            }
            chat.unseen = !!chat.unseen;
            if (!chat.last_msg) {
                chat.last_msg = 'Отправьте первое сообщение!';
                chat.unseen = true;
                chat.last_date = null;
            }
            chatBody.insertAdjacentHTML('beforeend', chatListItemTemplate({...chat}));
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
        const chatBody = this.chatBodyDiv;
        makeEmpty(chatBody);
        this.setDOMChatElements();
        this.chatHeaderDiv.querySelector('h2').innerText = title;
        this.showLoading(chatBody);
    }

    /**
     * On initial render all chat elements (header, footer)
     * ARE on the screen but invisible
     * so this function makes them appear
     */
    async #enableChatUI() {
        this.chatListBodyDiv;
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