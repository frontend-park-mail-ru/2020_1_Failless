'use strict';

import Controller from '../core/controller.js';
import ProfileView from '../views/profile-view.js';

/**
 * @class ProfileController
 */
export default class ProfileController extends Controller {

    /**
     * construct object of ProfileController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new ProfileView(parent);
    }

    action(routerInstance) {
        this.parent.innerHTML = '';
        this.view.render();
    }
}