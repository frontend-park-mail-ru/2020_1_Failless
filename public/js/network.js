class NetworkModule {
    #_baseUrl = `${window.location.protocol}//${window.location.host}`;

    fetchGet = ({
                path = '/',
                body = null,
            } = {}) => {
        return this.#_fetch({method: 'GET', path, body});
    };

    fetchPost = ({
                    path = '/',
                    body = null,
                } = {}) => {
        return this.#_fetch({method: 'POST', path, body});
    };

    #_fetch = ({
                method = 'GET',
                path = '/',
                body = null,
            } = {}) => {
        return fetch(this.#_baseUrl + path, {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body)
        });
    };
}

export default new NetworkModule();
