'use strict';

import View from '../core/view.js';

/**
 * @class create LoginView class
 */
export default class LoginView extends View {

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
        this.parent.innerHTML += Handlebars.templates['public/js/templates/login-template']()
    }
}