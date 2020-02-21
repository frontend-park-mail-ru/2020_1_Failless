'use strict';

import Controller from '../core/controller.js';
import LandingView from '../views/landing-view.js';

export default class LandingController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LandingView(parent);
    }

    action() {
        this.view.render();
    }
}