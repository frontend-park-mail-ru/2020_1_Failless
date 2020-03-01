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
        form.addEventListener('submit', this._loginHandler);
        const regBtn = document.getElementsByClassName('btn_color_w')[0];
        regBtn.addEventListener('click', this._signUpRedirect);
    }

    /**
     * Get data from input form on login page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromLogin(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');
        let data = {
            password: form[1].value,
        };
        let isMail = false;
        for (let item in form[0].value) {
            if (item === '@') {
                data.email = form[0].value;
                data.phone = '';
                isMail = true;
            }
        }
        if (!isMail) {
            data.phone = form[0].value;
            data.email = '';
        }
        return data
    }

    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginHandler = (event) => {
        event.preventDefault();

        const body = this._getFromLogin(event);

        UserModel.postLogin(body).then((user) => {
            if (Object.prototype.hasOwnProperty.call(user, 'name')) {
                window.history.pushState({}, '', '/profile');
                window.history.pushState({}, '', '/profile');
                window.history.back();
            } else {
                console.log(user);
                console.error('User is not authenticated');
            }
        });
    };

    /**
     * Handle click on login event
     * @param {event} event
     */
    _signUpRedirect = (event) => {
        event.preventDefault();
        
        window.history.pushState({}, '', '/signup');
        window.history.pushState({}, '', '/signup');
        window.history.back();

    };
}