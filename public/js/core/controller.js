'use strict';

import createHeader from './header.js';
import UserModel from '../models/user-model.js';

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
    }

    /**
     * virtual destructor
     */
    destructor() {
        console.log('I call the police');
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
        }).catch(onerror => {
            createHeader(this.parent, false);
            console.log('No internet connection');

        }).then(() => {
            const managePanel = document.getElementsByClassName('header__manage')[0];
            managePanel.addEventListener('click', this.#controlBtnPressed.bind(this));
            const logo = document.getElementsByClassName('header__logo gradient-text')[0];
            logo.addEventListener('click', this.#homeRedirect.bind(this));
            console.log(logo);
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
                this.#logoutRedirect();
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
        console.log('pressed');
        event.preventDefault();
        window.history.pushState({}, '', '/');
        window.history.pushState({}, '', '/');
        window.history.back();
    };

    /**
     * Handle click on login event
     */
    #logoutRedirect = () => {
        UserModel.getLogout().then((ok) => {
            if (ok) {
                window.history.pushState({}, '', '/');
                window.history.pushState({}, '', '/');
                window.history.back();
            } else {
                console.log('Client error, stay here');
            }
        });
    };

    /**
     * Handle click on home event
     * @param {Event} event
     */
    _profileRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/profile');
        window.history.pushState({}, '', '/profile');
        window.history.back();
    }

}
