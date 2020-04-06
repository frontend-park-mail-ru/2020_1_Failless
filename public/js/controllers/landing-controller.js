'use strict';

import Controller from 'Eventum/core/controller.js';
import LandingView from 'Eventum/views/landing-view.js';
import router from 'Eventum/core/router.js';

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

        document.querySelectorAll('.re_btn__white').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                router.redirectForward('/signup');
            });
        });

        this.addEventHandler(window, 'scroll', this.stickyHeader);
    }
}