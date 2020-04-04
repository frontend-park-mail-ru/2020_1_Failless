'use strict';

import View from 'Eventum/core/view.js';
import modalTemplate from 'Blocks/modal-window/template.hbs';

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
        document.body.insertAdjacentHTML('beforeend', modalTemplate(context));
    }

    clear() {
        document.body.getElementsByClassName('modal__bg')[0].remove();
    }
}