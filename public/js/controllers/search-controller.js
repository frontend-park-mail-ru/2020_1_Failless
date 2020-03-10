'use strict';

import Controller from '../core/controller.js';
import SearchView from '../views/search-view.js';

/**
 * @class SearchController
 */
export default class SearchController extends Controller {

    /**
     * Construct obj of SearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SearchView(parent);
    }

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();
    }
}