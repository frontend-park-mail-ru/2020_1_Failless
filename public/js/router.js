'use strict';

export default class Router {
    constructor() {
        this.urls = new Map();
    }

    addRoute(path, controller) {
        this.urls.set(path, controller)
    }

    route() {
        let current = window.location.pathname;
        let controller = this.urls.get(current);
        if (!controller) {
            // todo: 404 handler
            console.error('Controller not found');
            return
        }
        controller.action();
    }
}
