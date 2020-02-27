'use strict';

import UserModel from '../models/user-model.js'

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

    _handle(current) {
        let controller = this.urls.get(current);
        if (!controller) {
            // todo: 404 handler
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
        this._checkUserExist().then(user => {
            console.log(user);
            const userLogged = user.Logged;
            this.currentController.action(userLogged);
        });
    }
}
