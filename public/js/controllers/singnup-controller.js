'use strict';

import Controller from '../core/controller.js';
import SingUpView from '../views/singup-view.js';

export default class SignUpController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SingUpView(parent);
    }

    action() {
        this.view.render();
    }
}