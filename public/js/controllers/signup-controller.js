'use strict';

import Controller from '../core/controller.js';
import SignUpView from '../views/signup-view.js';
import UserModel from '../models/user-model.js';

export default class SignUpController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SignUpView(parent);
    }

    action() {
        super.action();
        this.view.render();
        const form = document.getElementById('form');
        form.addEventListener('submit', this._signUpHandler.bind(this));
        const regBtn = document.getElementsByClassName('btn_color_w')[0];
        regBtn.addEventListener('click', function (event) {
            event.preventDefault();

            window.history.pushState({}, '', '/login');
            window.history.pushState({}, '', '/login');
            window.history.back();
        });
        // const signUp = document.getElementsByClassName('btn btn_color_ok btn_size_large')[0];
        // signUp.addEventListener('click', this._signUpHandler.bind(this));

        // const loginRedirect = document.getElementsByClassName('btn btn_color_w btn_size_middle')[0];
        // loginRedirect.addEventListener('click', this._loginRedirect.bind(this));
    }

    // [HIGH-PRIORITY] TODO Добавить валидацию на пароль и прочий мусор

    /**
     * Get data from input form on sign up page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromSignUp(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');

        const name = form[0].value;
        const email = form[1].value;
        const phone = form[2].value;
        const password = form[3].value;
        const password2 = form[4].value;

        if (password !== password2) {
            console.log('Passwords must to be equal');
            return null;
        }

        return {name, password, phone, email};
    }

    // [HIGH-PRIORITY] TODO Половина функции - костыли и говно
    /**
     * Handle click on submit event
     * @param {event} event
     */
    _signUpHandler(event) {
        event.preventDefault();

        const body = this._getFromSignUp(event);
        if (!body) {
            console.log('do nothing');
            return;
        }

        UserModel.postSignup(body).then((response) => {
            if (Object.prototype.hasOwnProperty.call(response, 'name')) {
                console.log('redirect');
                document.getElementsByClassName('auth')[0].remove();
                window.history.pushState({}, '', '/login');
                window.history.pushState({}, '', '/login');
                window.history.back();
            } else {
                console.log('Client error, stay here');
                console.log(response);
                // response.json().then(data => { console.log(data.message); });
            }
        }).catch(reason => { console.log(reason); });
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