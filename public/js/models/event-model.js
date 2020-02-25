import NetworkModule from '../network.js';
import Model from '../core/model.js';

/**
 * @class EventModel
 */
export default class EventModel extends Model {

    /**
     * Create EventModel object
     */
    constructor() {
        super();
    }

    /**
     * Get event data from server
     * @return {Promise} promise to get user data
     */
    static getEvent() {
        return NetworkModule.fetchGet({path: '/event'}).then((response) => {
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