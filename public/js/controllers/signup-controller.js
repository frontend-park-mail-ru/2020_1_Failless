'use strict';

import Controller from 'Eventum/core/controller';
import SignUpView from 'Eventum/views/signup-view';
import UserModel from 'Eventum/models/user-model';
import ValidationModule from 'Eventum/utils/validation';
import Router from 'Eventum/core/router';
import Snackbar from 'Blocks/snackbar/snackbar';
import TextConstants from 'Eventum/utils/language/text';

export default class SignUpController extends Controller {

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SignUpView(parent);
        this.form = null;
        this.inputs = null;
        this.pending = false;
        this.inputManager = {
            braces: false,
            i: 0,
            text: '',
            three: false,
        };
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    /**
     * Create base business logic of SignUp
     */
    action() {
        UserModel.getLogin().then((user) => {
            if (!user) {
                return;
            }
            if (Object.prototype.hasOwnProperty.call(user, 'uid')) {
                Router.redirectForward('/');
                return;
            }
            super.action();
            this.view.render();
            this.#initView();
            this.initHandlers([
                {
                    attr: 'signup',
                    events: [
                        {type: 'submit', handler: this.#signUpSubmitHandler},
                    ]
                },
                {
                    attr: 'checkInput',
                    many: true,
                    events: [
                        {type: 'focus', handler: this.removeErrorMessage},
                        {type: 'blur', handler: this.#checkInputHandler},
                        {type: 'input', handler: this.#inputComponent},
                    ]
                }
            ]);
        });
    }

    /**
     * Initialize view
     */
    #initView() {
        let auth = document.body.getElementsByClassName('auth')[0];
        if (auth) {
            this.form = document.getElementById('form');
        }
    }

    /**
     * Get data from input form on sign up page
     * @return {{password: *, phone: *, name: *, email: *}} input form
     */
    #getFromSignUp() {
        const name = this.form[0].value;
        const email = this.form[1].value;
        let phone = this.form[2].value.replace(/[()+\-]/g, '');
        const password = this.form[3].value;
        const repeatPassword = this.form[4].value;

        let errors_list = [];
        errors_list.push(ValidationModule.validateUserData(name, 'name'));
        errors_list.push(ValidationModule.validateUserData(email, 'email'));
        errors_list.push(ValidationModule.validateUserData(phone, 'phone'));
        errors_list.push(ValidationModule.validateUserData(password, 'password'));
        errors_list.push(ValidationModule.validateUserData(repeatPassword, 'repeatPassword'));
        if (repeatPassword !== password) {
            errors_list.push(TextConstants.AUTH__PASS_ERROR);
        }

        if (errors_list.some(val => val.length !== 0)) {
            return void 0;
        }
        if (phone[0] === '7' || phone[0] === '8') {
            phone = phone.substr(1, phone.length);
        }

        return {name, password, phone, email};
    };

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    #signUpSubmitHandler = (event) => {
        event.preventDefault();

        if (this.pending) {
            return;
        }

        const body = this.#getFromSignUp();
        if (!body) {
            return;
        }
        this.removeErrorMessage(event);

        this.pending = true;
        this.view.showGlobalLoading();

        UserModel.postSignUp(body).then(
            (response) => {
                this.pending = false;
                this.view.removeGlobalLoading();

                if (Object.prototype.hasOwnProperty.call(response, 'name')) {
                    Snackbar.instance.addMessage(TextConstants.AUTH__SUCCESSFUL_SIGNUP);
                    setTimeout(() => {
                        Router.redirectForward('/login');
                    }, 1000);
                } else {
                    this.view.addErrorMessage(this.form, [response.message]);
                }
            },
            (reason) => {
                this.pending = false;
                this.view.removeGlobalLoading();
            });
    };

    /**
     * Handle blur event
     * @param {Event} event
     */
    #checkInputHandler = (event) => {
        const name = this.form[0].value;
        const email = this.form[1].value;
        const phone = this.form[2].value.replace(/\D/g, '');
        const password = this.form[3].value;
        const repeatPassword = this.form[4].value;

        switch (true) {
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
                this.view.addErrorMessage(this.form[4], [TextConstants.AUTH__PASS_ERROR]);
            }
            break;
        case (event.target === this.form[4]):
            const repeatPasswordCheck = ValidationModule.validateUserData(repeatPassword, 'repeatPassword');
            if (repeatPassword !== password) {
                repeatPasswordCheck.push(TextConstants.VALID__PASS_NO_MATCH);
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

    #inputComponent = (event) => {
        if (event.target.id !== 'phone') {
            return;
        }

        const input = this.view.getPhone();
        if (input.length > 16) {
            this.view.updatePhone(this.inputManager.text);
            return;
        }
        if (input.length < this.inputManager.text.length) {
            this.inputManager.text = input;
            switch (this.inputManager.i) {
            case 1: {
                this.inputManager.text = '';
                break;
            }
            case 4:
            case 7:
            case 9: {
                this.inputManager.text = this.inputManager.text.substr(0, this.inputManager.text.length - 1);
                break;
            }
            }
            this.inputManager.i--;
            this.view.updatePhone(this.inputManager.text);
            return;
        }

        if (input.charCodeAt(input.length - 1) < 48 || input.charCodeAt(input.length - 1) > 57) {
            this.inputManager.text = input.substr(0, input.length - 1);
            this.view.updatePhone(this.inputManager.text);
            return;
        }
        this.inputManager.text = input;

        if (this.inputManager.i === 0 && input.length === 1) {
            this.inputManager.text = '+7(' + this.inputManager.text;
        } else if (this.inputManager.i === 2) {
            this.inputManager.text = this.inputManager.text + ')';
        } else if (this.inputManager.i === 5 || this.inputManager.i === 7) {
            this.inputManager.text = this.inputManager.text + '-';
        }
        this.inputManager.i++;

        this.view.updatePhone(this.inputManager.text);
    };
}
