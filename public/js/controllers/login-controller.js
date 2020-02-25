'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';

/**
 * @class LoginController
 */
export default class LoginController extends Controller {

    /**
     * construct object of LoginController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LoginView(parent);
    }

    /**
     * Create action
     */
    action() {
        this.view.render();
    }
}