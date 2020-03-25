'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';
import UserModel from '../models/user-model.js';
import ValidationModule from '../utils/validation.js'

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
        this.form = document.getElementById('form');
        this.form.addEventListener('submit', this._loginSubmitHandler);
        this.form.addEventListener('input', this._loginInputHandler.bind(this));
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

    _addErrorMessage(element, messageValue) {
        element.insertAdjacentHTML('afterend', 
            Handlebars.templates['validation-error']({message: messageValue}));
    };

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    _loginInputHandler = (event) => {
        const inputs = this.form.getElementsByClassName('input input__auth');
        const login = inputs[0].value;

        let errors = document.getElementsByClassName('validation-error');
        while(errors.length > 0){
            errors[0].parentNode.removeChild(errors[0]);
        }

        if (event.target === inputs[0]) {
            let loginCheck;
            if (login.includes('@')) {
                const email = login;
                loginCheck = ValidationModule.validateUserData({email}, ['email']);
            } else {
                const phone = login;
                loginCheck = ValidationModule.validateUserData({phone}, ['phone']);
            }
            this._addErrorMessage(inputs[0], loginCheck);
        }
    };

    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginSubmitHandler = (event) => {
        event.preventDefault();

        if (!this._checkForErrors()) {
            console.log('errors in form');
            return
        }

        const body = this._getFromLogin(event);

        UserModel.postLogin(body).then((user) => {
            if (Object.prototype.hasOwnProperty.call(user, 'name')) {
                window.history.pushState({}, '', '/my/profile');
                window.history.pushState({}, '', '/my/profile');
                window.history.back();
            } else {
                console.log(user);
                console.error('User is not authenticated');
            }
        });
    };

    /**
     * Check if there are any errors
     * then don't send any requests
     */
    _checkForErrors() {
        const errors = this.form.getElementsByClassName('validation-error');
        return errors.length === 0;
    }
}