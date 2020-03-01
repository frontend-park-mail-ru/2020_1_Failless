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
     * Create action
     */
    action() {
        UserModel.getLogin().then((user) => {
            if (!Object.prototype.hasOwnProperty.call(user, 'uid')) {
                createHeader(this.parent, false);
                const sweetHomePage = document.getElementsByClassName('image icon_btn icon__size_m header__item')[0];
                sweetHomePage.addEventListener('click', this._homeRedirect);

                const userSignUp = document.getElementsByClassName('header__item')[1];
                userSignUp.addEventListener('click', this._signUpRedirect);

                const userLogin = document.getElementsByClassName('header__item')[2];
                userLogin.addEventListener('click', this._loginRedirect);
            } else {
                createHeader(this.parent, true);
                const sweetHomePage = document.getElementsByClassName('image icon_btn icon__size_m header__item')[0];
                sweetHomePage.addEventListener('click', this._homeRedirect);
                const eventSearch = document.getElementsByClassName('header__item')[1];
                eventSearch.addEventListener('click', this._eventSearchRedirect);

                const userLogout = document.getElementsByClassName('header__item')[2];
                userLogout.addEventListener('click', this._logoutRedirect);

                const userProfile = document.getElementsByClassName('header__item')[3];
                userProfile.addEventListener('click', this._profileRedirect);
            }
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

        window.history.pushState({}, '', '/event');
        window.history.pushState({}, '', '/event');
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

        window.history.pushState({}, '', '/profile');
        window.history.pushState({}, '', '/profile');
        window.history.back();
    }

}
