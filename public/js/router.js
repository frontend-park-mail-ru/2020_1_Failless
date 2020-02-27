'use strict';

/**
 * @class create Router class
 */
export default class Router {
    constructor() {
        this.urls = new Map();
        this.currentController = null;
    }

    /**
     * adding route function
     * @param path
     * @param controller
     */
    addRoute(path, controller) {
        this.urls.set(path, controller)
    }

    /**
     * route func
     */
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
        if (this.currentController) {
            this.currentController.destructor();
        }
        this.currentController = controller;
        console.log(controller);

        // if (document.getElementsByClassName('header').length === 0) {
        //     this.urls.get('/').action(this);
        // }
        // controller.action(this);
        this.currentController.action();
    }
}
