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
     * @return {Promise<WebSocket>} New socket
     * @reject {Promise<Error>} error
     */
    static async openChat(uid) {
        let socket = new WebSocket(`${settings.wsurl}:${settings.port}${settings.api}/chat/${uid}`);
        socket.onopen = () => {
            return Promise.resolve(socket);
        };
        socket.onerror = () => {
            return null;    // TODO: can't catch reject for some reason
        };
    }

    /**
     *
     * @param id1 - this user's id
     * @param id2 - match's id
     * @param limit - how many messages to fetch
     * @return {Promise<Array<{uid: Number, body: String}>>} - messages
     */
    static async getLastMessages(id1, id2, limit) {
        return NetworkModule.fetchGet({path: `/profile/${id1}/chat`, body: {id2: id2, limit: limit}}).then(
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