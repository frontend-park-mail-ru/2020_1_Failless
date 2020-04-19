'use strict';

import Controller from 'Eventum/core/controller.js';
import SignUpView from 'Eventum/views/signup-view.js';
import UserModel from 'Eventum/models/user-model.js';
import ValidationModule from 'Eventum/utils/validation.js';
import router from 'Eventum/core/router.js';

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

    /**
     * Initialize view
     */
    #initView() {
        let auth = document.body.getElementsByClassName('auth')[0];
        if (auth) {
            this.form = document.getElementById('form');
            this.addEventHandler(this.form, 'submit', this.#signUpSubmitHandler);
            // this.form.addEventListener('submit', this.#signUpSubmitHandler.bind(this));

            this.inputs = this.form.getElementsByClassName('input input__auth');
            for (let input of this.inputs) {
                this.addEventHandler(input, 'focus', this.removeErrorMessage.bind(this));
                this.addEventHandler(input, 'blur', this.#checkInputHandler);
                // input.addEventListener('focus', this.removeErrorMessage.bind(this));
                // input.addEventListener('blur', this.#checkInputHandler.bind(this));
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

        this.removeErrorMessage(event);

        UserModel.postSignUp(body).then((response) => {
            if (Object.prototype.hasOwnProperty.call(response, 'name')) {
                router.redirectForward('/login');
            } else {
                this.view.addErrorMessage(this.form, [response.message]);
            }
        }).catch(reason => console.log(reason));
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
        case (event.target === this.form[0]):
            const nameCheck = ValidationModule.validateUserData(name, 'name');
            this.view.addErrorMessage(this.form[0], nameCheck);
            break;
        case (event.target === this.form[1]):
            const emailCheck = ValidationModule.validateUserData(email, 'email');
            this.view.addErrorMessage(this.form[1], emailCheck);
            break;
        case (event.target === this.form[2]):
            const phoneCheck = ValidationModule.validateUserData(phone, 'phone');
            this.view.addErrorMessage(this.form[2], phoneCheck);
            break;
        case (event.target === this.form[3]):
            const passwordCheck = ValidationModule.validateUserData(password, 'password');
            this.view.addErrorMessage(this.form[3], passwordCheck);

            if (repeatPassword !== password) {
                this.view.addErrorMessage(this.form[4], ['Пароли не совпадают']);
            }
            break;
        case (event.target === this.form[4]):
            const repeatPasswordCheck = ValidationModule.validateUserData(repeatPassword, 'repeatPassword');
            if (repeatPassword !== password) {
                repeatPasswordCheck.push('Пароли не совпадают');
            }
            this.view.addErrorMessage(this.form[4], repeatPasswordCheck);
            break;
        }
    };

    // Method inheritance doesn't work due to arrow functions :c
    removeErrorMessage = (event) => {
        event.preventDefault();

        if (event.target === this.form[3]) {
            this.form[4].classList.remove('input__auth_incorrect');
            let errorElement = this.form[4].parentNode.getElementsByClassName('validation-error')[0];
            if (errorElement) {
                errorElement.remove();
            }
        }

        event.target.classList.remove('input__auth_incorrect');
        let errorElement = event.target.parentNode.getElementsByClassName('validation-error')[0];
        if (errorElement) {
            errorElement.remove();
        }
    };
}
