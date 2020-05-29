import Model from 'Eventum/core/model';
import settings from 'Settings/config';

let matchModelSymbol = Symbol('Model for match');
let matchModelEnforcer = Symbol('The only object that can create MatchModel');

/**
 * @class MatchModel
 */
export default class MatchModel extends Model {

    /**
     * Create MatchModel object
     */
    constructor(enforcer) {
        super();
        if (enforcer !== matchModelEnforcer) {
            throw 'Instantiation failed: use MatchModel.instance instead of new()';
        }

        this.socket = null;
    }

    static get instance() {
        if (!this[matchModelSymbol]) {
            this[matchModelSymbol] = new MatchModel(matchModelEnforcer);
        }
        return this[matchModelSymbol];
    }

    static set instance(v) {
        throw 'Can\'t change constant property!';
    }

    async establishConnection(uid, onMessage) {
        let socket = new WebSocket(`${settings.wsurl}:${settings.port}/ws/match`);
        socket.onopen = () => {
            this.socket = socket;

            socket.send(JSON.stringify({uid: Number(uid)}));
            this.socket.onmessage = onMessage;
            return socket;
        };
        socket.onerror = (error) => {
            return null;
        };
    }

    /**
     * Ping - pong
     */
    async sendMessage() {
        this.socket.send(JSON.stringify({}));
    }
}