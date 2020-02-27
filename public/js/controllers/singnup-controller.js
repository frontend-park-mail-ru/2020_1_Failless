'use strict';

import Controller from '../core/controller.js';
import SingUpView from '../views/singup-view.js';

/**
 * @class SignUpController
 */
export default class SignUpController extends Controller {

    /**
     * construct object of SignUpController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SingUpView(parent);
    }

    /**
     * Create action
     */
    action() {
        this.view.render();
    }
}