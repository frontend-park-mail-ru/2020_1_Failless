'use strict';

import Controller from '../core/controller.js';
import LandingView from '../views/landing-view.js';
import Header from '../core/header.js'

/**
 * @class LandingController
 */
export default class LandingController extends Controller {

    /**
     * construct object of LandingController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LandingView(parent);
    }

    /**
     * Create action
     */
    action(userLogged) {
        // this.parent.innerHTML = "";
        Header.create(userLogged, this.parent);
        // if (!this.view.viewExist()) {
            this.view.render();
            // this.view.exist = true;
        // }
    }
}