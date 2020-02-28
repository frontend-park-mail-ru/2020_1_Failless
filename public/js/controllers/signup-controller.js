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
        form.addEventListener('submit', this._submitHandler);
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

    /**
     * Get data from input form on sign up page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromSignUp(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');

        const userName = form[0].value;
        const userEmail = form[1].value;
        const userPhone = form[2].value;
        const userPass = form[3].value;
        const userPassAgain = form[4].value;

        return {userName, userPass, userPhone, userEmail};
    }

    /**
     * Handle click on submit event
     * @param {event} event
     */
    _signUpHandler(event) {
        event.preventDefault();

        const body = this._getFromSignUp(event);

        UserModel.postSignup(body).then((ok) => {
            if (ok) {
                document.getElementsByClassName('auth')[0].remove();
                window.history.pushState({}, '', '/profile');
                window.history.pushState({}, '', '/profile');
                window.history.back();
            } else {
                console.log('Client error, stay here');
            }
        });
    }

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