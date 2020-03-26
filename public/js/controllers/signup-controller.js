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

    /**
     * Create base business logic of SignUp
     */
    action() {
        super.action();
        this.view.render();
        const form = document.getElementById('form');
        form.addEventListener('submit', this._signUpHandler.bind(this));
        // const regBtn = document.getElementsByClassName('re_btn re_btn__outline')[0];
        // regBtn.addEventListener('click', function (event) {
        //     event.preventDefault();
        //
        //     window.history.pushState({}, '', '/login');
        //     window.history.pushState({}, '', '/login');
        //     window.history.back();
        // });
    }

    /**
     * Get data from input form on sign up page
     * @param {Event} event
     * @return {{password: *, phone: *, name: *, email: *}} input form
     */
    _getFromSignUp(event) {
        // todo: rewrite get data from form by id to using event object
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

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    _signUpHandler(event) {
        event.preventDefault();

        const body = this._getFromSignUp(event);
        if (!body) {
            console.log('do nothing');
            return;
        }

        UserModel.postSignUp(body).then((response) => {
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

    /**
     * Handle click on login event
     * @param {Event} event
     */
    _loginRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/login');
        window.history.pushState({}, '', '/login');
        window.history.back();
    }
}
