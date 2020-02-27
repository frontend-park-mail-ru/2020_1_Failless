'use strict';

import Controller from '../core/controller.js';
import ProfileView from '../views/profile-view.js';
import Header from '../core/header.js';

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

    action(userLogged) {
        Header.create(userLogged, this.parent);
        this.view.render();
    }
}