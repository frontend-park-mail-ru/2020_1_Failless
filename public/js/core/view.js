'use strict';

import errorTemplate from 'Blocks/validation-error/template.hbs';
import serverErrorTemplate from 'Blocks/error/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic.js';

/**
 * Base view class
 */
export default class View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Render template
     */
    render() {
    }

    /**
     * Add error message
     * @param {HTMLElement} element - html element
     * @param {string[]} messageValue - array of validation errors
     */
    addErrorMessage(element, messageValue) {
        if (messageValue.length === 0) {
            return;
        }

        element.classList.add('input__auth_incorrect');
        element.insertAdjacentHTML('beforebegin', errorTemplate({message: messageValue[0]}));
    }

    async showServerError(element, message) {
        makeEmpty(element);
        element.insertAdjacentHTML('beforeend', serverErrorTemplate({message: message}));
    }
}
