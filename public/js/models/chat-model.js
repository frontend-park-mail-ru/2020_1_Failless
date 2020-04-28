import NetworkModule from 'Eventum/core/network';
import Model from 'Eventum/core/model';
import settings from 'Settings/config';

/**
 * @class ChatModel
 */
export default class ChatModel extends Model {
    /**
     * Create ChatModel object
     */
    constructor() {
        super();
        this.userID = null;
    }

    /**
     *
     * @param uid
     * @param chatId
     * @return {Promise<WebSocket>} New socket
     * @reject {Promise<Error>} error
     */
    static async openChat(uid, chatId) {
        let socket = new WebSocket(`${settings.wsurl}:3003/ws/connect`);
        socket.onopen = () => {
            console.log(socket);
            // TODO: send uid and chatId
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
        return NetworkModule.fetchGet({path: `/user/chats/${id1}`, body: {chatId: chatId, limit: limit}}).then(
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
}