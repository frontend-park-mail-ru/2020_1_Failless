'use strict';

import Controller from '../core/controller.js';
import LandingView from '../views/landing-view.js';

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
    action() {
        super.action();
        this.view.render();
    }
}