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
        document.addEventListener('DOMContentLoaded', () => {
            // TODO: add eventlisteners
        });
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
                document.getElementsByClassName('header__item')[1].addEventListener(
                    'click', this._signUpRedirect);
                document.getElementsByClassName('header__item')[2].addEventListener(
                    'click', this._loginRedirect);
            } else {
                createHeader(this.parent, true);
                document.getElementsByClassName('header__item')[1].addEventListener(
                    'click', this._feedRedirect);
                document.getElementsByClassName('header__item')[2].addEventListener(
                    'click', this._profileRedirect);
            }
            document.getElementsByClassName('header__logo gradient-text')[0].addEventListener(
                'click', this._homeRedirect);
            document.getElementsByClassName('header__item')[0].addEventListener(
                'click', this._eventSearchRedirect);
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

        window.history.pushState({}, '', '/my/profile');
        window.history.pushState({}, '', '/my/profile');
        window.history.back();
    }

    _setActiveLink(index) {
        // TODO: remove all active links
        //  Add active link on chosen index (look in my-controller.js)
    }

    _feedRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/feed/users');
        window.history.pushState({}, '', '/feed/users');
        window.history.back();
    }
}
