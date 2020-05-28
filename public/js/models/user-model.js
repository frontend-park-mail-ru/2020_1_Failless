'use strict';

import NetworkModule from 'Eventum/core/network';
import settings from 'Settings/config';
import Model from 'Eventum/core/model';

/**
 * @class UserModel
 */
export default class UserModel extends Model {

    /**
     * Create UserModel object
     */
    constructor() {
        super();
        this.user = null;
        this.profile = null;
    }

    /**
     * Send user login data to server
     * @param {Object} userData - json with login data
     * @return {Promise} promise to set user login data
     */
    static postLogin(userData) {
        return NetworkModule.fetchPost({path: '/signin', body: userData}).then(
            (response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json().then(user => {
                    this.user = user;
                    return user;
                });
            },
            (error) => {
                throw new Error(error);
            });
    }

    /**
     * Get user login data from server
     * @return {Promise} promise to get user login data
     */
    static async getLogin() {
        if (this.user) {
            return this.user;
        }
        return NetworkModule.fetchGet({path: '/getuser'}).then(
            (response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json().then((user) => {
                    this.user = user;
                    return user;
                });
            },
            (error) => {
                throw new Error(error);
            });
    }

    /**
     * Make user logout on server
     * @return {Promise} promise to get user logout data
     */
    static getLogout() {
        if (this.user) {
            return NetworkModule.fetchGet({path: '/logout'}).then(
                (response) => {
                    if (response.status > 499) {
                        throw new Error('Server error');
                    }
                    this.user = null;
                    this.profile = null;
                    return response.json();
                },
                (error) => {
                    throw new Error(error);
                });
        } else {
            return new Promise((resolve => resolve({message: 'Unauthorized', status: 401})));
        }
    }

    /**
     * Send user signup data from server
     * @return {Promise} promise to set new user data
     */
    static postSignUp(newUserData) {
        return NetworkModule.fetchPost({path: '/signup', body: newUserData}).then(
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
     * Save user's description
     * @param about {string}
     */
    static putAbout(about) {
        return NetworkModule.fetchPut({path: `/profile/${this.user.uid}/meta/about`, body: {about: about}})
            .then(response => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            })
            .catch(error => {throw new Error(error);});
    }

    /**
     * Save user's description
     * @param tags {Array<Number>}
     */
    static putTags(tags) {
        return NetworkModule.fetchPut({path: `/profile/${this.user.uid}/meta/tags`, body: {tags: tags}})
            .then(response => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            })
            .catch(error => {throw new Error(error);});
    }

    /**
     * Send user image data to server
     * @param images {Array<{
     *     img: string | null,
     *     path: string | null,
     * }>}
     * @return {Promise} promise to set new user data
     */
    static putPhotos(images) {
        return NetworkModule.fetchPut({path: `/profile/${this.user.uid}/meta/photos`, body: images})
            .then(response => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json()
                    .then(photos => {
                        if (photos.message) {
                            throw new Error(photos.message);
                        } else {
                            return photos;
                        }
                    });})
            .catch(error => {throw new Error(error);});
    }

    /**
     * Send user profile data to server
     * @return {Promise} promise to set new user data
     */
    static getProfile() {
        return this.getLogin().then(user => {
            if (user) {
                if (this.profile) {
                    return this.profile;
                }
                return NetworkModule.fetchGet({path: '/profile/' + user.uid, api: settings.api}).then(
                    (response) => {
                        if (response.status > 499) {
                            throw new Error('Server error');
                        }
                        return response.json().then((profile) => {
                            this.profile = profile;
                            return profile;
                        });
                    },
                    (error) => {
                        throw new Error(error);
                    });
            } else {
                return new Promise((resolve => resolve({message: 'Authentication required', status: 409})));
            }
        });
    }

    /**
     * Send query to add tag to profile's tags
     * @param tags - tags to add
     */
    static addTags(tags) { // TODO: i dunno the path
        return NetworkModule.fetchPut({path: '', body: tags}).then(
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
     * Send query to remove tag from profile's tags
     * @param tag
     */
    static removeTag(tag) { // TODO: i dunno the path
        return NetworkModule.fetchPut({path: '', body: tag}).then(
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
