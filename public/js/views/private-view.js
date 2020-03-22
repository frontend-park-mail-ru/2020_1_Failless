'use strict';

import View from '../core/view.js';

/**
 * @class create PrivateView class
 */
export default class PrivateView extends View {

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
        console.log('private view renders');
        this.parent.insertAdjacentHTML('beforeend', Handlebars.templates['private']());
    }
}