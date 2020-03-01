import settings from '../../settings/config.js';

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
        return fetch(settings.url + ':' + settings.port + settings.api + path, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
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
        return fetch(settings.url + ':' + settings.port + settings.api + path, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body)
        });
    };
}
