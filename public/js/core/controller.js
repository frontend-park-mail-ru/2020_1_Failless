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
     * Create action
     */
    action() {
        console.log('controller action');
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
        console.log('She\'s kind of cute');
    }

    /**
     * Handle click on home event
     * @param {Event} event
     */
    _homeRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/');
        window.history.pushState({}, '', '/');
        window.history.back();
    }

    /**
     * Handle click on event search event
     * @param {event} event
     */
    _eventSearchRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/search');
        window.history.pushState({}, '', '/search');
        window.history.back();
    }

    /**
     * Handle click on sign up event
     * @param {Event} event
     */
    _signUpRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/signup');
        window.history.pushState({}, '', '/signup');
        window.history.back();
    }

    /**
     * Handle click on login event
     * @param {Event} event
     */
    _loginRedirect(event) {
        event.preventDefault();

        window.history.pushState({}, '', '/login');
        window.history.pushState({}, '', '/login');
        window.history.back();
    }

    /**
     * Handle click on login event
     * @param {Event} event
     */
    _logoutRedirect(event) {
        event.preventDefault();

        UserModel.getLogout().then((ok) => {
            if (ok) {
                window.history.pushState({}, '', '/');
                window.history.pushState({}, '', '/');
                window.history.back();
            } else {
                console.log('Client error, stay here');
            }
        });
    }

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
