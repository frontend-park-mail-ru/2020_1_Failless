'use strict';

import View from '../core/view.js';

/**
 * @class create NewsView class
 */
export default class NewsView extends View {

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
    render(message) {
        this.parent.insertAdjacentHTML('beforeend', Handlebars.templates['news']({message}));
    }
}