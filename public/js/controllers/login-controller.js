'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';
import UserModel from '../models/user-model.js';

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

    action() {
        super.action();
        this.view.render();
        const form = document.getElementById('form');
        form.addEventListener('submit', this._submitHandler);
        const regBtn = document.getElementsByClassName('btn_color_w')[0];
        regBtn.addEventListener('click', function (event) {
            event.preventDefault();
            window.history.pushState({}, '', '/signup');
            window.history.pushState({}, '', '/signup');
            window.history.back();
        });
        // this.view.render();
        // const login = document.getElementsByClassName('btn btn_color_ok btn_size_middle')[0];
        // login.addEventListener('click', this._loginHandler.bind(this));
        //
        // const signUpRedirect = document.getElementsByClassName('btn btn_color_w btn_size_large')[0];
        // signUpRedirect.addEventListener('click', this._signUpRedirect.bind(this));
    }

    /**
     * Get data from input form on login page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromLogin(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');;

        const userEmail = form[0].value;
        const userPass = form[1].value;

        return {userEmail, userPass};
    }

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
                console.error('User is not authenticated');
            }
        });
    }

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