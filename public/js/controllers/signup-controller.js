'use strict';

import Controller from '../core/controller.js';
import SignUpView from '../views/signup-view.js';
import UserModel from '../models/user-model.js';
import ValidationModule from '../utils/validation.js'

export default class SignUpController extends Controller {

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SignUpView(parent);

        this.form = null;
        this.inputs = null;
    }

    /**
     * Create base business logic of SignUp
     */
    action() {
        super.action();
        this.view.render();
        this.#initView();
    }

    #initView() {
        let auth = document.body.getElementsByClassName('auth')[0];
        if (auth) {
            this.form = document.getElementById('form');
            this.form.addEventListener('submit', this.#signUpSubmitHandler.bind(this));

            this.inputs = this.form.getElementsByClassName('input input__auth');
            for (let input of this.inputs) {
                input.addEventListener('focus', this.#removeErrorMessage.bind(this));
                input.addEventListener('blur', this.#checkInputHandler.bind(this));
            }
        }
    }

    /**
     * Get data from input form on sign up page
     * @param {Event} event
     * @return {{password: *, phone: *, name: *, email: *}} input form
     */
    #getFromSignUp() {
        const name = this.form[0].value;
        const email = this.form[1].value;
        const phone = this.form[2].value;
        const password = this.form[3].value;
        const repeatPassword = this.form[4].value;

        let errors_list = [];
        errors_list.push(ValidationModule.validateUserData(name, 'name'));
        errors_list.push(ValidationModule.validateUserData(email, 'email'));
        errors_list.push(ValidationModule.validateUserData(phone, 'phone'));
        errors_list.push(ValidationModule.validateUserData(password, 'password'));
        errors_list.push(ValidationModule.validateUserData(repeatPassword, 'repeatPassword'));
        if (repeatPassword !== password) {
            errors_list.push('Пароли не совпадают');
        }
        
        if (errors_list.some(val => val.length !== 0)) {
            return void 0;
        }

        return {name, password, phone, email};
    };

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    #signUpSubmitHandler = (event) => {
        event.preventDefault();

        const body = this.#getFromSignUp();
        if (!body) {
            console.log('do nothing');
            return;
        }

        this.#removeErrorMessage(event);

        UserModel.postSignUp(body).then((response) => {
            if (Object.prototype.hasOwnProperty.call(response, 'name')) {
                window.history.pushState({}, '', '/login');
                window.history.pushState({}, '', '/login');
                window.history.back();
            } else {
                console.log(response);
                this.#addErrorMessage(this.form[1], [response.message]);
            }
        }).catch(reason => console.log(reason));
    };

    #addErrorMessage(element, messageValue) {
        if (messageValue.length === 0) {
            return;
        }

        element.classList.add('input__auth__incorrect');
        element.insertAdjacentHTML('beforebegin',
            Handlebars.templates['validation-error']({message: messageValue[0]}));
    };

    #removeErrorMessage = (event) => {
        event.preventDefault();

        event.target.classList.remove('input__auth__incorrect');
        let errorElement = event.target.parentNode.getElementsByClassName('validation-error')[0];
        if (errorElement) {
            errorElement.remove();
        }
    };

    /**
     * Handle blur event
     * @param {Event} event
     */
    #checkInputHandler = (event) => {
        const name = this.form[0].value;
        const email = this.form[1].value;
        const phone = this.form[2].value;
        const password = this.form[3].value;
        const repeatPassword = this.form[4].value;

        switch(true) {
        case (event.target === form[0]):
            const nameCheck = ValidationModule.validateUserData(name, 'name');
            this.#addErrorMessage(form[0], nameCheck);
            break;
        case (event.target === form[1]):
            const emailCheck = ValidationModule.validateUserData(email, 'email');
            this.#addErrorMessage(form[1], emailCheck);
            break;
        case (event.target === form[2]):
            const phoneCheck = ValidationModule.validateUserData(phone, 'phone');
            this.#addErrorMessage(form[2], phoneCheck);
            break;
        case (event.target === form[3]):
            const passwordCheck = ValidationModule.validateUserData(password, 'password');
            this.#addErrorMessage(form[3], passwordCheck);

            if (repeatPassword !== password) {
                this.#addErrorMessage(form[4], ['Пароли не совпадают']);
            }
            break;
        case (event.target === form[4]):
            const repeatPasswordCheck = ValidationModule.validateUserData(repeatPassword, 'repeatPassword');
            if (repeatPassword !== password) {
                repeatPasswordCheck.push('Пароли не совпадают');
            }
            this.#addErrorMessage(form[4], repeatPasswordCheck);
            break;
        }
    };
}
