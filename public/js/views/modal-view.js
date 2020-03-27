'use strict';

import View from '../core/view.js';

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
        console.log('modal view constructs');
    }

    /**
     * Render template
     * @param {JSON} context
     */
    render(context) {
        console.log('modal view renders');
        document.body.insertAdjacentHTML('beforeend', Handlebars.templates['modal-window'](context));
    }

    clear() {
        console.log('modal view clears');
        document.body.getElementsByClassName('modal__bg')[0].remove();
    }
}