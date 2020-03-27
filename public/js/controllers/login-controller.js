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
        this.form = null;
        this.inputs = null;
        document.addEventListener('DOMContentLoaded', () => {
            let auth = document.body.getElementsByClassName('auth')[0];
            if (auth) {
                console.log('adding event listeners');
                // Events for form
                this.form = document.getElementById('form');
                this.form.addEventListener('submit', this._loginSubmitHandler);

                // Events for inputs in particular
                this.inputs = this.form.getElementsByClassName('input input__auth');
                for (let iii = 0; iii < this.inputs.length; iii++) {
                    this.inputs[iii].addEventListener('focus', this._removeErrorMessage.bind(this));
                    this.inputs[iii].addEventListener('blur', this._checkInputHandler.bind(this));
                }
            }
        })
    }

    action() {
        super.action();
        this.view.render();
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
     * Checks validity of separate input
     * @param event
     * @private
     */
    _checkInputHandler = (event) => {
        event.preventDefault();
        this._checkInput(event.target);
    };

    _checkInput(input) {
        let arg2 = this._getInputType(input);

        // TODO: make it work like this
        // this._addErrorMessage(input.value, ValidationModule.validateUserData({arg1}, [arg2]))
    }

    _getInputType(input) {
        if (input.type === 'text') {
            const attrs = input.parentNode.getElementsByClassName('auth__help')[0].attributes;
            if (attrs[attrs.length - 1].value === 'login') {    // check last attribute
                return 'name';
            } else {
                if (input.value.includes('@')) {
                    return 'email';
                } else {
                    return 'phone';
                }
            }
        }
        return input.type;
    }

    _addErrorMessage(element, messageValue) {
        if (!messageValue) {
            return
        }
        element.classList.add('input__auth__incorrect');
        element.insertAdjacentHTML('beforebegin',
            Handlebars.templates['validation-error']({message: messageValue}));
    };

    _removeErrorMessage = (event) => {
        event.preventDefault();

        event.target.classList.remove('input__auth__incorrect');
        let errorElement = event.target.parentNode.getElementsByClassName('validation-error')[0];
        if (errorElement) {
            errorElement.remove();
        }
    };

    /**
     * Check all inputs of the form
     */
    _inputsChecker() {
        // TODO: iterate over all inputs and add errors where it's needed
        //  - use this._checkInput(input) (modify it as you wish)
        //  - addMessages in this func or embed in _checkInput func or somewhere else
        //  !important :  try to make this func usable for both login- and signup- controllers
        //    if it's too complicated - screw it

        // const login = this.inputs[0].value;
        //
        // let errors = document.getElementsByClassName('validation-error');
        // while(errors.length > 0){
        //     errors[0].parentNode.removeChild(errors[0]);
        // }
        //
        // if (event.target === this.inputs[0]) {
        //     let loginCheck;
        //     if (login.includes('@')) {
        //         const email = login;
        //         loginCheck = ValidationModule.validateUserData({email}, ['email']);
        //     } else {
        //         const phone = login;
        //         loginCheck = ValidationModule.validateUserData({phone}, ['phone']);
        //     }
        //     this._addErrorMessage(this.inputs[0], loginCheck);
        // }
    };

    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginSubmitHandler = (event) => {
        event.preventDefault();

        // this one should check all inputs and add errors if needed
        this._inputsChecker(event);

        // request won't be sent if there are errors
        if (!this._checkForErrors()) {
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