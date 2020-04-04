'use strict';

import View from 'Eventum/core/view.js';

/**
 *
 */
export default class ModalView extends View {

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
     * @param {JSON} context
     */
    render(context) {
        document.body.insertAdjacentHTML('beforeend', Handlebars.templates['modal-window'](context));
    }

    clear() {
        document.body.getElementsByClassName('modal__bg')[0].remove();
    }
}