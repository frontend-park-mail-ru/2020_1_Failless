'use strict';

import createHeader from './header.js';
import UserModel from '../models/user-model.js';
import logoutRedirect from '../utils/logout.js';

/**
 * @class Basic controller class
 */
export default class Controller {

    /**
     * Construct obj of basic controller class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
        document.addEventListener('DOMContentLoaded', () => {
            // TODO: add eventlisteners
        });
    }

    /**
     * virtual destructor
     */
    destructor() {
        this.parent.innerHTML = '';
        // todo: remove listeners
    }

    /**
     * Create action and render header
     */
    action() {
        UserModel.getLogin().then((user) => {
            if (!Object.prototype.hasOwnProperty.call(user, 'uid')) {
                createHeader(this.parent, false);
            } else {
                createHeader(this.parent, true);
            }
        }).catch((onerror) => {
            createHeader(this.parent, false);
            console.log('No internet connection');
        }).then(() => {
            const managePanel = document.getElementsByClassName('header__manage')[0];
            managePanel.addEventListener('click', this.#controlBtnPressed.bind(this));
            const logo = document.getElementsByClassName('header__logo gradient-text')[0];
            logo.addEventListener('click', this.#homeRedirect.bind(this));
        });
    }

    /**
     * Handle button pressed event on the header block by button url
     * @param {Event} event
     * @private
     */
    #controlBtnPressed = (event) => {
        event.preventDefault();
        if (event.target.tagName === 'A') {
            let href = event.target.getAttribute('href');
            if (href === '') {
                href = '/';
            }

            if (href === '/logout') {
                logoutRedirect(event);
                return;
            }

            window.history.pushState({}, '', href);
            window.history.pushState({}, '', href);
            window.history.back();
        }
    };


    /**
     * Handle click on home event
     * @param {Event} event
     */
    #homeRedirect = (event) => {
        event.preventDefault();
        window.history.pushState({}, '', '/');
        window.history.pushState({}, '', '/');
        window.history.back();
    };

    #setActiveLink = (index) => {
        // TODO: remove all active links
        //  Add active link on chosen index (look in my-controller.js)
    };
}
