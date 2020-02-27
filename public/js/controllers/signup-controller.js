'use strict';

import Controller from '../core/controller.js';
import SignUpView from '../views/signup-view.js';
import UserModel from '../models/user-model.js';
import Header from '../core/header.js'

export default class SignUpController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SignUpView(parent);
    }

    action(userLogged) {
        Header.create(userLogged, this.parent);
        this.view.render();

        const signUp = document.getElementsByClassName('btn btn_color_ok btn_size_large')[0];
        signUp.addEventListener('click', this._signUpHandler.bind(this));

        const loginRedirect = document.getElementsByClassName('btn btn_color_w btn_size_middle')[0];
        loginRedirect.addEventListener('click', this._loginRedirect.bind(this));
    }

    // [HIGH-PRIORITY] TODO Добавить валидацию на пароль и прочий мусор

    /**
     * Get data from input form on sign up page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromSignUp(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');

        const userName = form[0].value;
        const userEmail = form[1].value;
        const userPhone = form[2].value;
        const userPass = form[3].value;
        const userPassAgain = form[4].value;

        return {userName, userPass, userPhone, userEmail};
    }

    // [HIGH-PRIORITY] TODO Половина функции - костыли и говно
    /**
     * Handle click on submit event
     * @param {event} event
     */
    _signUpHandler(event) {
        event.preventDefault();

        const body = this._getFromSignUp(event);

        UserModel.postSignup(body).then((ok) => {
            if (ok) {
                document.getElementsByClassName('auth')[0].remove();
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
    _loginRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/login');
        window.history.pushState({}, '', '/login');
        window.history.back();
    }
}