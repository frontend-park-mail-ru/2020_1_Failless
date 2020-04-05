import NetworkModule from 'Eventum/core/network.js';
import Model from 'Eventum/core/model.js';

/**
 * @class EventModel
 */
export default class EventModel extends Model {

    /**
     * Create EventModel object
     */
    constructor() {
        super();
        this.tags = null;
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
     * @param {{query: string, limit: number, page: number}} eventsRequest - request with query, limits and page
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

    /**
     * Get event data from server
     * @param {{uid: number, id: number, value: number}} vote - request with query, limits and page
     * @param {boolean} isLike - is this request for like
     * @return {Promise} promise to get user data
     */
    static userVote(vote, isLike) {
        let url = `/users/${vote.id}/`;
        url += isLike ? 'like' : 'dislike';
        return NetworkModule.fetchPost({
            path: url,
            body: vote
        }).then((response) => {
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
     * @param {{uid: number, id: number, value: number}} vote - request with query, limits and page
     * @param {boolean} isLike - is this request for like
     * @return {Promise} promise to get user data
     */
    static eventVote(vote, isLike) {
        let url = `/event/${vote.id}/`;
        url += isLike ? 'like' : 'dislike';
        return NetworkModule.fetchPost({
            path: url,
            body: vote
        }).then((response) => {
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
     * Get all tags from server
     * @return {Promise} promise to get user login data
     */
    static getTagList() {
        if (this.tags) {
            return new Promise((resolve) => {
                resolve(this.tags);
            });
        }
        return NetworkModule.fetchGet({path: '/tags/feed'}).then((response) => {
            if (response.status > 499) {
                throw new Error('Server error');
            }
            return response.json().then((tags) => {
                this.tags = tags;
                return tags;
            });
        },
        (error) => {
            return new Promise((resolve) => {
                resolve({err: error});
            });
        });
    }

    static createEvent(body) {
        return NetworkModule.fetchPost({path: '/event/new', body: body}).then((response) => {
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
