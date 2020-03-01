import NetworkModule from '../core/network.js';
import Model from '../core/model.js';

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
        return NetworkModule.fetchPost({path: '/signin', body: userData}).then((response) => {
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
    static getLogin() {
        if (this.user) {
            return new Promise((resolve) => {
                resolve(this.user);
            });
        }
        return NetworkModule.fetchGet({path: '/getuser/' + this.user.uid}).then((response) => {
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
            return NetworkModule.fetchGet({path: '/logout'}).then((response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                this.user = null;
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
        return NetworkModule.fetchPost({path: '/signup', body: newUserData}).then((response) => {
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
     * Send user profile data to server
     * @return {Promise} promise to set new user data
     */
    static postProfile(profileUserData) {
        return NetworkModule.fetchPost({path: '/profile/' + this.user.uid, body: profileUserData}).then((response) => {
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
     * Send user profile data to server
     * @return {Promise} promise to set new user data
     */
    static getProfile() {
        if (this.user) {
            return NetworkModule.fetchGet({path: '/profile/' + this.user.uid}).then((response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            },
            (error) => {
                throw new Error(error);
            });
        } else {
            return new Promise((resolve => resolve({message: 'Authentication required', status: 409})));
        }
    }

    static isAuth() {
        if (this.user) {
            return new Promise((resolve) => {
                resolve(this.user);
            });
        } else {
            return new Promise((resolve => resolve({message: 'Not authenticated', status: 401})));
        }
    }
}