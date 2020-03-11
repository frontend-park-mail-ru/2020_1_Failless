'use strict';

import View from '../core/view.js';

/**
 * @class create LandingView class
 */
export default class LandingView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    /**
     * Render template
     */
    render() {
        const landing = Handlebars.templates['landing']();
        this.parent.insertAdjacentHTML('beforeend', landing);
    }
}