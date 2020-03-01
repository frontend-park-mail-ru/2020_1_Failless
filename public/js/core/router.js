'use strict';

import UserModel from '../models/user-model.js';

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
     * @param {string} path
     * @param {Controller} controller
     */
    addRoute(path, controller) {
        this.urls.set(path, controller);
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

    _checkUserExist() {
        return UserModel.getLogin();
    }

    /**
     * Handle current url path
     * @param {string} current
     * @private
     */
    _handle(current) {
        let controller = this.urls.get(current);
        if (!controller) {
            // todo: 404 handler
            let app = document.getElementById('application');
            app.innerHTML = '404 Not Found';
            
            console.log(current);
            console.log(this.urls);
            console.error('Controller not found');
            return;
        }
        if (this.currentController) {
            this.currentController.destructor();
        }
        this.currentController = controller;
        console.log(controller);
        this.currentController.action();
    }
}
