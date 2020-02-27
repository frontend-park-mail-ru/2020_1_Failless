'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';
import UserModel from '../models/user-model.js';
import Header from '../core/header.js'

/**
 * @class LoginController
 */
export default class LoginController extends Controller {

    /**
     * construct object of LoginController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LoginView(parent);
        this.events = [];
    }

    action(userLogged) {
        Header.create(userLogged, this.parent);
        this.view.render();

        const login = document.getElementsByClassName('btn btn_color_ok btn_size_middle')[0];
        login.addEventListener('click', this._loginHandler.bind(this));

        const signUpRedirect = document.getElementsByClassName('btn btn_color_w btn_size_large')[0];
        signUpRedirect.addEventListener('click', this._signUpRedirect.bind(this));
    }

    // [HIGH-PRIORITY] TODO Добавить валидацию на пароль и прочий мусор

    /**
     * Get data from input form on login page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromLogin(event) {
        // const form = document.getElementById('form');

        const form = document.getElementById('form').getElementsByClassName('input input__auth');;

        const userEmail = form[0].value;
        const userPass = form[1].value;

        return {userEmail, userPass};
    }

    // [HIGH-PRIORITY] TODO Половина функции - костыли и говно
    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginHandler(event) {
        event.preventDefault();

        const body = this._getFromLogin(event);

        UserModel.postLogin(body).then((ok) => {
            if (ok) {
                window.history.pushState({}, '', '/profile');
                window.history.pushState({}, '', '/profile');
                window.history.back();
            } else {
                console.log('Client error, stay here');
            }
        });
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on login event
     * @param {event} event
     */
    _signUpRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/signup');
        window.history.pushState({}, '', '/signup');
        window.history.back();

    }
}