import NetworkModule from '../core/network.js';
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
     * @param {{query: string, page: number}} eventsRequest - request with query, limits and page
     * @return {Promise} promise to get user data
     */
    static getEvents(eventsRequest) {
        return NetworkModule.fetchPost({path: '/events/search', body: eventsRequest}).then((response) => {
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
     * Get event data from server
     * @param {{query: string, page: number}} eventsRequest - request with query, limits and page
     * @return {Promise} promise to get user data
     */
    static getFeedEvents(eventsRequest) {
        return NetworkModule.fetchPost({path: '/events/feed', body: eventsRequest}).then((response) => {
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
     * Get event data from server
     * @param {{query: string, page: number}} eventsRequest - request with query, limits and page
     * @return {Promise} promise to get user data
     */
    static getFeedUsers(eventsRequest) {
        return NetworkModule.fetchPost({path: '/users/feed', body: eventsRequest}).then((response) => {
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