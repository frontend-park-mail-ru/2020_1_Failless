'use strict';

import NewProfileView from '../views/new-profile-view.js';
import MyController from './my-controller.js';

/**
 * @class NewProfileController
 */
export default class NewProfileController extends MyController {

    /**
     * construct object of NewProfileController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new NewProfileView(parent);
    }

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();
        document.addEventListener('DOMContentLoaded', () => {
            this._highlightCircle(2);
        });
    }
}