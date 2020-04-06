'use strict';

import View from 'Eventum/core/view.js';
import myTemplate from 'Components/my/template.hbs';

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
        this.parent.insertAdjacentHTML('beforeend', myTemplate());
    }
}