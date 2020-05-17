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
import {prettifyDateTime, setChatListItemAsUnread} from 'Blocks/chat-list-item/chat-list-item';
import ChatModel from 'Eventum/models/chat-model';
import TextConstants from 'Eventum/utils/language/text';

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

    destructor() {
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
    async renderChatList() {
        const chatBody = this.chatListBody;
        makeEmpty(chatBody);
        ChatModel.instance.chats.forEach((chat) => {
            if (!chat.avatar) {
                chat.avatar = images.get('user-default');
            }
            chat.new = !!chat.unseen;
            chat.last_msg = chat.last_msg.substring(5); // backend sends last message with a 5 useless chars
            chat.last_date = prettifyDateTime(chat.last_date);
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
        if (chatBody.firstElementChild.className.includes('spinner') || chatBody.firstElementChild.className.includes('error')) {
            makeEmpty(chatBody);
        }
        messages.forEach((message) => {
            this.renderMessage(message)
            // chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}))
        });
        scrollChatDown(chatBody);
    }

    /**
     * Render one particular message
     * @param message {{
     *      body: String,
     *      side: 'right'|'left',
     *      new: boolean}}
     */
    renderMessage(message) {
        const chatBody = this.chatBodyDiv;
        // Get last message
        const lastMessage = chatBody.lastElementChild;
        const side = message.side;
        if (lastMessage && lastMessage.classList.contains(`chat-message_${side}`)) {
            if (lastMessage.classList.contains(`chat-message_first_${side}`)) {
                lastMessage.classList.remove(`chat-message_last_${side}`);
            } else {
                lastMessage.classList.replace(`chat-message_last_${side}`, `chat-message_mid_${side}`)
            }
        } else {    // if no last message or message is for the other side
            message.style = `chat-message_first_${side}`;
        }

        chatBody.insertAdjacentHTML('beforeend', chatMessageTemplate({...message}));
        scrollChatDown(chatBody);
        showMessage(chatBody.lastElementChild);
    }

    /**
     * Title speaks for itself
     * @param message{{
     *      chat_id: String
     *      message: String
     *      created: String
     * }}
     * @param self {boolean}
     */
    async updateLastMessage(message, self) {
        // Find chat list item with chat_id
        let chatToUpdate = this.chatListBodyDiv.querySelector(`.chat-list-item[data-cid="${message.chat_id}"]`);
        console.log(chatToUpdate);

        // Set it as unread
        if (!self) {
            setChatListItemAsUnread(chatToUpdate).then();
        } else {
            chatToUpdate.querySelector('.chat-list-item__message').innerText = `${TextConstants.BASIC__YOU}: ${message.message}`;
        }

        // Update message its message
        chatToUpdate.querySelector('.chat-list-item__time').innerText = prettifyDateTime(message.created);
    }
}