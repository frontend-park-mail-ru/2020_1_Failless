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
            return response.json();
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
        return NetworkModule.fetchGet({path: '/getuser'}).then((response) => {
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
     * Make user logout on server
     * @return {Promise} promise to get user logout data
     */
    static getLogout() {
        return NetworkModule.fetchGet({path: '/logout'}).then((response) => {
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
     * Send user signup data from server
     * @return {Promise} promise to set new user data
     */
    static postSignup(newUserData) {
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
        return NetworkModule.fetchPost({path: '/profile', body: profileUserData}).then((response) => {
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
        return NetworkModule.fetchGet({path: '/profile'}).then((response) => {
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