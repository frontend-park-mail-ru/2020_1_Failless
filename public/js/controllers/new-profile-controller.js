'use strict';

import NewProfileView from '../views/new-profile-view.js';
import PrivateController from './private-controller.js';

/**
 * @class NewProfileController
 */
export default class NewProfileController extends PrivateController {

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
        document.addEventListener('DOMContentLoaded', () => {this._highlightCircle(2);});
    }
}