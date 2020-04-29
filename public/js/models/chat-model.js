import NetworkModule from 'Eventum/core/network';
import Model from 'Eventum/core/model';
import UserModel from 'Eventum/models/user-model';
import settings from 'Settings/config';

/**
 * @class ChatModel
 */
export default class ChatModel extends Model {
    /**
     * Create ChatModel object
     */
    constructor(uid) {
        super();

        this.chats = [];

        this.socket = null;
        let socket = new WebSocket(`${settings.wsurl}:3003/ws/connect`);
        socket.onopen = () => {
            console.log(socket);
            this.socket = socket;

            socket.send(JSON.stringify({uid: Number(uid)}));
            return Promise.resolve(socket);
        };
        socket.onerror = () => {
            return null;    // TODO: can't catch reject for some reason
        };
    }

    /**
     *
     * @param id1 - this user's id
     * @param chatId - chat id
     * @param limit - how many messages to fetch
     * @return {Promise<Array<{uid: Number, body: String}>>} - messages
     */
    static async getLastMessages(id1, chatId, limit) {
        return NetworkModule.fetchPut({path: `/${id1}`, api: settings.chat, body: {uid: id1, chat_id: chatId, limit: limit, page: 1}}).then(
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
    static getChats(body = null) {
        return UserModel.getLogin().then(
            (user) => {
                return NetworkModule.fetchPost({path: '/list', api: settings.chat, body: body})
                    .then((response) => {
                        if (response.status > 499) {
                            throw new Error('Server error');
                        }
                        return response.json().then((chats) => {
                            return chats;
                        });
                    });
            },
            (error) => {
                throw new Error(error);
            }
        );
    }
}