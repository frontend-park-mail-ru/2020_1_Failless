import settings from 'Settings/config.js';
import getCookie from 'Eventum/utils/csrf.js';

/**
 * The class implements methods for calling communicating with the server API
 */
export default class NetworkModule {

    /**
     * @param {string} path Path to send the query to
     * @return {Promise} Promise for the HTTP request
     */
    static fetchGet = ({
        path = '/',
    } = {}) => {
        if (path.includes('undefined')) {
            return new Promise((resolve, reject) => {
                reject(new Error('Invalid path, boy'));
            });
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + settings.api + path, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': token
            },
        });
    };

    /**
     * @param {string} path Path to send the query to
     * @param {Object} body Body of the query (will be serialized as json)
     * @return {Promise} Promise for the HTTP request
     */
    static fetchPost = ({
        path = '/',
        body = null,
    } = {}) => {
        if (path.includes('undefined')) {
            return new Promise((resolve, reject) => {
                reject(new Error('Invalid path, boy'));
            });
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + settings.api + path, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-CSRF-Token': token
            },
            body: JSON.stringify(body)
        });
    };

    /**
     * @param {string} path Path to send the query to
     * @param {Object} body Body of the query (will be serialized as json)
     * @return {Promise} Promise for the HTTP request
     */
    static fetchPut = ({
        path = '/',
        body = null,
    } = {}) => {
        if (path.includes('undefined')) {
            return new Promise((resolve, reject) => {
                reject(new Error('Invalid path, boy'));
            });
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + settings.api + path, {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-CSRF-Token': token
            },
            body: JSON.stringify(body)
        });
    };
}
