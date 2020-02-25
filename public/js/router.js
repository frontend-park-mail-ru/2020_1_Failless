'use strict';

export default class Router {
    constructor() {
        this.urls = new Map();
    }

    addRoute(path, controller) {
        this.urls.set(path, controller)
    }

    route() {
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this._handle(currentPath);
        });
        this._handle(window.location.pathname);
    }

    _handle(current) {
        let controller = this.urls.get(current);
        if (!controller) {
            // todo: 404 handler
            console.log(current);
            console.log(this.urls);
            console.error('Controller not found');
            return
        }
        console.log(controller);
        controller.action();
    }
}
