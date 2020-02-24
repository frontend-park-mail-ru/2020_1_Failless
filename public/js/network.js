import settings from '../settings/config.js';

// TODO: rewrite settings.url + window.location.pathname + path
export default class NetworkModule {

    static fetchGet = ({
                path = '/',
            } = {}) => {
        return fetch(settings.url + window.location.pathname + path, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        });
    };

    static fetchPost = ({
                    path = '/',
                    body = null,
                } = {}) => {
        return fetch(settings.url + window.location.pathname + path, {
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
