'use strict';

import View from 'Eventum/core/view.js';
import landingTemplate from 'Components/landing/template.hbs';

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
        const landing = landingTemplate();
        this.parent.insertAdjacentHTML('beforeend', landing);
    }
}