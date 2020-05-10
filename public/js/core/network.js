'use strict';

import settings from 'Settings/config';
import getCookie from 'Eventum/utils/csrf';

/**
 * The class implements methods for calling communicating with the server API
 */
export default class NetworkModule {

    /**
     * @param path {string} Path to send the query to
     * @param api
     * @return {Promise} Promise for the HTTP request
     */
    static fetchGet = ({
        path = '/',
        api = settings.api,
    } = {}) => {
        if (path.includes('undefined')) {
            throw new Error('Invalid path, boy');
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + api + path, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': token
            },
        });
    };

    /**
     * @param path {string} Path to send the query to
     * @param body {Object} Body of the query (will be serialized as json)
     * @param api {String}
     * @return {Promise} Promise for the HTTP request
     */
    static fetchPost = ({
        path = '/',
        body = null,
        api = settings.api,
    } = {}) => {
        if (path.includes('undefined')) {
            throw new Error('Invalid path, boy');
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + api + path, {
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
     * @param path {string} Path to send the query to
     * @param body {Object} Body of the query (will be serialized as json)
     * @param api {String}
     * @return {Promise} Promise for the HTTP request
     */
    static fetchPut = ({
        path = '/',
        body = null,
        api = settings.api,
    } = {}) => {
        if (path.includes('undefined')) {
            throw new Error('Invalid path, boy');
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + api + path, {
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

    /**
     * @param path {string} Path to send the query to
     * @param body {Object} Body of the query (will be serialized as json)
     * @param api {string}
     * @return Promise {Promise} for the HTTP request
     */
    static fetchDelete = ({
        path = '/',
        body = null,
        api = settings.api,
    } = {}) => {
        if (path.includes('undefined')) {
            throw new Error('Invalid path, boy');
        }
        const token = getCookie('csrf');
        return fetch(settings.url + ':' + settings.port + api + path, {
            method: 'DELETE',
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
