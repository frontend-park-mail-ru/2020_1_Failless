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
        this.modalWindow = null;
    }

    destructor() {
        this.modalWindow = null;
    }

    setHandlers(buttonHandler) {
        this.modalWindow = this.parent.querySelector('.modal__bg');
        this.modalWindow.querySelector('.modal__header-icon').addEventListener(
            'click',
            this.clear,
        );
        this.modalWindow.querySelector('.re_btn.re_btn__outline').addEventListener(
            'click',
            buttonHandler,
        );
    }

    /**
     * Render template
     * @param {JSON} context
     */
    render(context) {
        this.parent.insertAdjacentHTML('beforeend', modalTemplate(context));
    }

    clear() {
        if (!this.modalWindow) {
            document.querySelector('.modal__bg').remove();
        } else {
            this.modalWindow.remove();
        }
    }
}