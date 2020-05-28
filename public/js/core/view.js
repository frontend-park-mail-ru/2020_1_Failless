'use strict';

import validationErrorTemplate from 'Blocks/validation-error/template.hbs';
import errorTemplate from 'Blocks/error/template.hbs';
import loadingTemplate from 'Blocks/loading/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import {icons} from 'Eventum/utils/static-data';
import TextConstants from 'Eventum/utils/language/text';

/**
 * Base view class
 */
export default class View {
    vDOM = {};

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
        this.globalLoader = null;
    }

    /**
     * Render template
     */
    render() {
    }

    /**
     * Add error message
     * @param {Element} element - html element
     * @param {string[]} messageValue - array of validation errors
     */
    addErrorMessage(element, messageValue) {
        if (messageValue.length === 0) {
            return;
        }

        element.classList.add('input__auth_incorrect');
        element.insertAdjacentHTML('beforebegin', validationErrorTemplate({message: messageValue[0]}));
    }

    /**
     * Show Server error inside an element
     * !use with caution!
     * @param {Element} element
     * @param {String} message
     * @param {String} icon - name of icon as in static-data.js
     * @param {String} button - title for button
     * @return {Promise<void>}
     */
    async showError(element, message, icon, button) {
        makeEmpty(element);
        element.insertAdjacentHTML('beforeend', errorTemplate({
            icon: icons.get(icon),
            message: message,
            button: button,
        }));
    }

    /**
     * Show loading animation inside an element
     * @param element
     * @return {Promise<void>}
     */
    async showLoading(element) {
        makeEmpty(element);
        element.insertAdjacentHTML('beforeend', loadingTemplate({LOADING: TextConstants.BASIC__LOADING}));
    }

    async showGlobalLoading() {
        document.body.insertAdjacentHTML('beforeend', loadingTemplate({global: 'global', LOADING: TextConstants.BASIC__LOADING}));
        this.globalLoader = document.body.querySelector('.spinner_global');
        setTimeout(() => {
            if (this.globalLoader) {
                this.globalLoader.classList.remove('spinner_appear');
            }
        }, 500);
    }

    async removeGlobalLoading() {
        this.globalLoader.remove();
        this.globalLoader = null;
    }
}
