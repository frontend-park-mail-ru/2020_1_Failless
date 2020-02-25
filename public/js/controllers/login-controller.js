'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';

export default class LoginController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LoginView(parent);
    }

    action() {
        this.view.render();
        const form = document.getElementById('form');
    }
}