'use strict';

import View from '../core/view.js';

/**
 * @class create MyView class
 */
export default class MyView extends View {

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
        this.parent.insertAdjacentHTML('beforeend', Handlebars.templates['my']());
    }
}