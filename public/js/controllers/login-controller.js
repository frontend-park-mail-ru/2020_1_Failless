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

        this.form = null;
        this.inputs = null;
    }

    action() {
        super.action();
        this.view.render();
        this._initView();
    }

    _initView() {
        let auth = document.body.getElementsByClassName('auth')[0];
        if (auth) {
            this.form = document.getElementById('form');
            this.form.addEventListener('submit', this._loginSubmitHandler.bind(this));

            this.inputs = this.form.getElementsByClassName('input input__auth');
            for (let input of this.inputs) {
                input.addEventListener('focus', this._removeErrorMessage.bind(this));
                input.addEventListener('blur', this._checkInputHandler.bind(this));
            }
        }
    }

    /**
     * Get data from input form on sign up page
     * @param {Event} event
     * @return {{password: *, phone: *, name: *, email: *}} input form
     */
    _getFromLogin() {
        const login = this.form[0].value;
        let phone = '';
        let email = '';
        const password = this.form[1].value;

        let errors_list = [];
        if (login.includes('@')) {
            email = login;
            errors_list.push(ValidationModule.validateUserData(email, 'email'));
        } else {
            phone = login;
            errors_list.push(ValidationModule.validateUserData(phone, 'phone'));
        }
        
        if (errors_list.some(val => val.length !== 0)) {
            return void 0;
        }

        return {phone, email, password};
    }

    _checkInputHandler(event) {
        event.preventDefault();

        const login = this.form[0].value;

        switch(true) {
            case (event.target === form[0] && login.includes('@')):
                const nameCheck = ValidationModule.validateUserData(login, 'email');
                this._addErrorMessage(form[0], nameCheck);
                break;
            case (event.target === form[0]):
                const emailCheck = ValidationModule.validateUserData(login, 'phone');
                this._addErrorMessage(form[0], emailCheck);
                break;
        }
    }

    _addErrorMessage(element, messageValue) {
        if (messageValue.length === 0) {
            return;
        }

        element.classList.add('input__auth__incorrect');
        element.insertAdjacentHTML('beforebegin',
            Handlebars.templates['validation-error']({message: messageValue}));
    };

    _removeErrorMessage(event) {
        event.preventDefault();

        event.target.classList.remove('input__auth__incorrect');
        let errorElement = event.target.parentNode.getElementsByClassName('validation-error')[0];
        if (errorElement) {
            errorElement.remove();
        }
    };

    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginSubmitHandler(event) {
        event.preventDefault();

        const body = this._getFromLogin();

        if (!body) {
            console.log('do nothing');
            return;
        }

        this._removeErrorMessage(event);

        UserModel.postLogin(body).then((response) => {
            if (Object.prototype.hasOwnProperty.call(response, 'name')) {
                window.history.pushState({}, '', '/profile');
                window.history.pushState({}, '', '/profile');
                window.history.back();
            } else {
                console.log(response);
                this._addErrorMessage(document.getElementById('form'), response.message);
            }
        });
    };
}