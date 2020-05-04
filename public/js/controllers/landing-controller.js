'use strict';

import Controller from 'Eventum/core/controller.js';
import LandingView from 'Eventum/views/landing-view.js';
import Router from 'Eventum/core/router';

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

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();
        this.initHandlers([
            {
                attr: 'signup',
                many: true,
                events: [
                    {type: 'click', handler: Router.redirectForward.bind(this, '/signup')},
                ]
            },
        ]);

        this.addEventHandler(window, 'scroll', this.stickyHeader);
    }
}