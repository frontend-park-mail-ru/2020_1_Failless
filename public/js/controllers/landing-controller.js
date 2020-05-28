'use strict';

import Controller from 'Eventum/core/controller';
import LandingView from 'Eventum/views/landing-view';
import Router from 'Eventum/core/router';
import UserModel from 'Eventum/models/user-model';
import Snackbar from 'Blocks/snackbar/snackbar';

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
        UserModel.getLogin().then((user) => {
            if (!user) {
                Snackbar.instance.addMessage(TextConstants.BASIC__ERROR_FUN);
                return;
            }
            if (Object.prototype.hasOwnProperty.call(user, 'uid')) {
                this.view.render(true);
            } else {
                this.view.render();
            }
            this.initHandlers([
                {
                    attr: 'signup',
                    many: true,
                    events: [
                        {type: 'click', handler: Router.redirectForward.bind(this, '/signup')},
                    ]
                },
                {
                    attr: 'feed',
                    many: true,
                    events: [
                        {type: 'click', handler: Router.redirectForward.bind(this, '/feed')},
                    ]
                },
            ]);

            this.addEventHandler(window, 'scroll', this.stickyHeader);
        });
    }
}