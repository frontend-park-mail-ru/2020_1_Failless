'use strict';

import Controller from 'Eventum/core/controller.js';
import LoginView from 'Eventum/views/login-view.js';
import UserModel from 'Eventum/models/user-model.js';
import ValidationModule from 'Eventum/utils/validation.js';
import router from 'Eventum/core/router.js';

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
        this.pending = false;
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    action() {
        super.action();
        this.view.render();
        this.#initView();
        this.initHandlers([
            {
                attr: 'login',
                events: [
                    {type: 'submit', handler: this.#loginSubmitHandler},
                ]
            },
            {
                attr: 'checkInput',
                many: true,
                events: [
                    {type: 'focus', handler: this.removeErrorMessage},
                    {type: 'blur', handler: this.#checkInputHandler},
                ]
            }
        ]);
    }

    #initView() {
        let auth = document.body.getElementsByClassName('auth')[0];
        if (auth) {
            this.form = document.getElementById('form');
        }
    }

    _showSetEventModal(event) {
        document.getElementsByClassName('modal__container')[0].style.display = 'flex';
    }

    _hideSetEventModal(event) {
        document.getElementsByClassName('modal__container')[0].style.display = 'none';
    }

    /**
     * Get data from input form on sign up page
     * @return {{password: *, phone: *, name: *, email: *}} input form
     */
    #getFromLogin() {
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

    #checkInputHandler = (event) => {
        event.preventDefault();

        const login = this.form[0].value;

        switch(true) {
        case (event.target === form[0] && login.includes('@')):
            const nameCheck = ValidationModule.validateUserData(login, 'email');
            this.view.addErrorMessage(this.form[0], nameCheck);
            break;
        case (event.target === form[0]):
            const emailCheck = ValidationModule.validateUserData(login, 'phone');
            this.view.addErrorMessage(this.form[0], emailCheck);
            break;
        }
    };

    /**
     * Handle click on login event
     * @param {event} event
     */
    #loginSubmitHandler = (event) => {
        event.preventDefault();

        if (this.pending) {
            return;
        }

        const body = this.#getFromLogin();

        if (!body) {
            return;
        }

        this.pending = true;
        this.view.showGlobalLoading();

        this.removeErrorMessage(event);

        UserModel.postLogin(body).then((user) => {
            this.pending = false;
            this.view.removeGlobalLoading();
            if (Object.prototype.hasOwnProperty.call(user, 'name')) {
                router.redirectForward('/my/profile');
            } else {
                this.view.addErrorMessage(this.form, [user.message]);
            }
        });
    };
}