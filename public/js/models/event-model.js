'use strict';

import NetworkModule from 'Eventum/core/network';
import Model from 'Eventum/core/model';
import settings from 'Settings/config';

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
     * @param {{limit: Number, page: Number}} eventsRequest - request with query, limits and page
     * @return {Promise} promise to get user data
     */
    static getEvents(eventsRequest) {
        let errors = this.invalidEventRequest(eventsRequest);
        if (errors.length !== 0) {
            throw new Error(...errors);
        }
        return NetworkModule.fetchPost({path: '/events/search', body: eventsRequest}).then(
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
     * Get event data from server
     * @param {{query: string, page: number}} feedRequest - request with filters
     * @return {Promise} promise to get user data
     */
    static getFeedUsers(feedRequest) {
        let errors = this.invalidEventRequest(feedRequest);
        if (errors.length !== 0) {
            throw new Error(...errors);
        }
        return NetworkModule.fetchPost({path: '/users/feed', body: feedRequest}).then(
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
     * Get event data from server
     * @param {{uid: number, id: number, value: number}} vote - request with query, limits and page
     * @param {boolean} isLike - is this request for like
     * @return {Promise} promise to get user data
     */
    static userVote(vote, isLike) {
        let url = '/users/';
        url += isLike ? 'like' : 'dislike';
        return NetworkModule.fetchPut({path: url, body: vote, api: settings.api,}).then(
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
     * Get all tags from server
     * @return {Promise} promise to get user login data
     */
    static getTagList() {
        if (this.tags) {
            return this.tags;
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

    static getEventFollowers(eid) {
        if (!eid) {
            return new Promise(((resolve, reject) => {
                reject(new Error('Invalid event id'));
            }));
        }
        return NetworkModule.fetchGet({path: `/event/${eid}/follow`}).then(
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

    static getUserEvents(eid) {
        if (!eid) {
            return new Promise(((resolve, reject) => {
                reject(new Error('Invalid event id'));
            }));
        }
        return NetworkModule.fetchGet({path: `/event/${eid}/follow`}).then(
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
     * Get events which user liked
     * @param uid
     * @return {Promise<unknown>}
     */
    static getUserSubscriptions(uid) {
        return NetworkModule.fetchGet({path: `/profile/${uid}/subscriptions`, api: settings.api}).then(
            (response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            },
            (error) => {
                console.error(error);
                throw new Error(error);
            });
    }

    /**
     * Subscribe user (uid) to this event (eid)
     * @param {Number} uid
     * @param {Number} eid
     * @param {String} type - mid/big event
     */
    static followEvent(uid, eid, type) {
        return NetworkModule.fetchPost({path: `/event/${eid}/follow`, body: {uid: Number(uid), eid: Number(eid), type: type}}).then(
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

    static invalidEventRequest(eventRequest) {
        let message = [];
        const mustHaveProperties = [
            {
                name: 'page',
                type: 'number',
            },

            {
                name: 'limit',
                type: 'number',
            },
        ];
        const mayHaveProperties = [
            {
                name: 'uid',
                type: 'number',
            },
            {
                name: 'query',
                type: 'string',
            },
            {
                name: 'userLimit',
                type: 'number',
            },
            {
                name: 'tags',
                type: 'object',
            },
            {
                name: 'location',
                type: 'string',
            },
            {
                name: 'men',
                type: 'boolean',
            },
            {
                name: 'women',
                type: 'boolean',
            },
        ];

        mustHaveProperties.every((prop) => {
            if (Object.prototype.hasOwnProperty.call(eventRequest, prop.name)) {
                if (typeof eventRequest.page !== prop.type) {
                    message.push(
                        `Invalid type of property "${prop.name}"\n` +
                        `\tExpected ${prop.type}\n` +
                        `\tActual ${typeof eventRequest.page}\n`);
                }
            } else {
                message.push('No property "' + prop.name + '"\n');
            }
        });
        mayHaveProperties.every((prop) => {
            if (Object.prototype.hasOwnProperty.call(eventRequest, prop.name)) {
                if (typeof eventRequest.page !== prop.type) {
                    message.push(
                        `Invalid type of property "${prop.name}"\n` +
                        `\tExpected ${prop.type}\n` +
                        `\tActual ${typeof eventRequest.page}\n`);
                }
            }
        });
        return message;
    }
}
