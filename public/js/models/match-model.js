import Model from 'Eventum/core/model';
import settings from 'Settings/config';
import NetworkModule from 'Eventum/core/network';
import UserModel from 'Eventum/models/user-model';

/**
 * @class ChatModel
 */
export default class MatchModel extends Model {

    /**
     * Create ChatModel object
     */
    constructor() {
        super();
        this.socket = null;
    }

    async establishConnection(uid, onMessage) {
        let socket = new WebSocket(`${settings.wsurl}:3000/ws/match`);
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
}