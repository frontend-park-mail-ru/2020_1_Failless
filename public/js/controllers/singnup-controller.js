'use strict';

import Controller from '../core/controller.js';
import SingUpView from '../views/signup-view.js';
import UserModel from '../models/user-model';

export default class SignUpController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SingUpView(parent);
    }

    action() {
        this.view.render();
        const form = document.getElementById('form');
        form.addEventListener('submit', this._submitHandler.bind(this));
        const loginBtn = document.getElementsByClassName('btn_color_w')[0];
        loginBtn.addEventListener('click', function (event) {
            event.preventDefault();

            window.history.pushState({}, '', '/login');
            window.history.pushState({}, '', '/login');
            window.history.back();
        });
    }

    _submitHandler(event) {
        console.log('I am alive');
        event.preventDefault();
        const fields = document.getElementsByClassName('input__auth');
        if (fields.length !== 5) {
            throw Error;
        }
        if (fields[3].value !== fields[4].value) {
            // todo: handle error
            console.log('Passwords must be equal');
            return;
        }
        let form = {
            name: fields[0].value,
            email: fields[1].value,
            phone: fields[2].value,
            password: fields[3].value,
        };
        console.log(form);

        UserModel.postSignup(form).then(response => {
            if (response.status > 499) {
                console.log('errors were occurred');
                return;
            }
            if (response.status > 399) {
                // todo: print error msg to user and msg about his data
                console.log(response.json().message);
                return;
            }
            window.history.pushState({}, '', '/login');
            window.history.pushState({}, '', '/login');
            window.history.back();
        }).catch(onerror => {
            console.error('error was occurred');
            console.error(onerror);
        });
    }
}