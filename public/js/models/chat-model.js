'use strict';

import NetworkModule from 'Eventum/core/network';
import Model from 'Eventum/core/model';
import UserModel from 'Eventum/models/user-model';
import settings from 'Settings/config';

let chatModelSymbol = Symbol('Model for chats');
let chatModelEnforcer = Symbol('The only object that can create ChatModel');

export default class ChatModel extends Model {

    /**
     * Create ChatModel object
     */
    constructor(enforcer) {
        super();
        if (enforcer !== chatModelEnforcer) {
            throw 'Instantiation failed: use ChatModel.instance instead of new()';
        }

        this.chatMap = new Map();
        this.socket = null;
    }

    static get instance() {
        if (!this[chatModelSymbol])
            this[chatModelSymbol] = new ChatModel(chatModelEnforcer);
        return this[chatModelSymbol];
    }

    static set instance(v) {
        throw 'Can\'t change constant property!';
    }

    /***********************************************
                    Main functions
     ***********************************************/

    /**
     *
     * @param message {{
     *      uid:        number,
     *      message:    string,
     *      chat_id:    number}}
     * @return {Promise<void>}
     */
    async sendMessage(message) {
        this.socket.send(JSON.stringify(message));
    }

    async establishConnection(uid, onMessage) {
        let socket = new WebSocket(`${settings.wsurl}:3000/ws/connect`);
        socket.onopen = () => {
            console.log(socket);
            this.socket = socket;

            socket.send(JSON.stringify({uid: Number(uid)}));
            this.socket.onmessage = onMessage;
            return socket;
        };
        socket.onerror = (error) => {
            console.log(error);
            return null;
        };
    }

    /**
     *
     * @param id1 - this user's id
     * @param chatId - chat id
     * @param limit - how many messages to fetch
     * @return {Promise<Array<{uid: Number, body: String}>>} - messages
     */
    async getLastMessages(id1, chatId, limit) {
        return NetworkModule.fetchPut({path: `/${chatId}`, api: settings.chat, body: {uid: id1, chat_id: Number(chatId), limit: limit, page: 1}}).then(
            (response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            },
            (error) => {
                throw new Error(error);
            });
    }

    /**
     * Fetch list of user's chats
     * @return {Promise<unknown>}
     */
    async getChats(body = null) {
        return UserModel.getLogin()
            .then(user => NetworkModule.fetchPost({path: '/list', api: settings.chat, body: body}))
            .then((response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json().then((chats) => {
                    return chats;
                });})
            .catch(error => {throw new Error(error);});
    }

    /***********************************************
                 Additional get functions
     ***********************************************/

    get chats() {
        return this.chatMap;
    }

    /**
     * Set chatMap
     * @param chats Array<{
     *     chat_id:     number,
     *     name:        string,
     *     photos:      Array<string | null>,
     *     title:       string,
     *     active:      boolean,
     *     avatar:      string,
     *     last_date:   string,
     *     last_msg:    string,
     *     name:        string,
     *     new:         true,
     *     page:        number,
     *     unseen:      number
     * }>
     */
    set chats(chats) {
        chats.forEach(chat => {
            let newChat = {...chat};
            newChat.active = false;
            this.chatMap.set(chat.chat_id, newChat);
        });
    }
}
