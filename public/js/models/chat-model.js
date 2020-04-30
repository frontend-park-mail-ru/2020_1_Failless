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
    constructor(uid, onMessage) {
        super();

        this.chats = [];
        this.connected = null;
        this.socket = null;
        let socket = new WebSocket(`${settings.wsurl}:3000/ws/connect`);
        socket.onopen = () => {
            console.log(socket);
            this.socket = socket;
            this.connected = true;

            socket.send(JSON.stringify({uid: Number(uid)}));
            this.socket.onmessage = onMessage;
        };
        socket.onerror = (error) => {
            this.connected = false;
            console.log(error);
        };
    }

    async connectedOrElse() {
        while (this.connected === null) {
            await setTimeout(()=>{}, 500);
            console.log(this.connected);
        }
        return this.connected;
    }

    /**
     *
     * @param id1 - this user's id
     * @param chatId - chat id
     * @param limit - how many messages to fetch
     * @return {Promise<Array<{uid: Number, body: String}>>} - messages
     */
    static async getLastMessages(id1, chatId, limit) {
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
