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
     * @return {Promise} promise to set user login data
     */
    static postLogin(login, pass) {
        const userData = {
            login: login,
            pass: pass,
        };
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
     * Send user login data to server
     * @return {Promise} promise to set user login data
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
     * Make user logout data on server
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
        // const newUserData = {
        //     name: userName,
        //     phone: userPhone,
        //     email: userEmail,
        //     password: userPass,
        // };
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
}