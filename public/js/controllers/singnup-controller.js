'use strict';

import Controller from '../core/controller.js';
import SingUpView from '../views/singup-view.js';

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
        form.addEventListener('submit', this._submitHandler);
        const loginBtn = document.getElementsByClassName('btn_color_w')[0];
        loginBtn.addEventListener('click', function (event) {
            event.preventDefault();

            window.history.pushState({}, '', '/login');
            window.history.pushState({}, '', '/login');
            window.history.back();
        });
    }

    _submitHandler(event) {
        event.preventDefault();
        const fields = document.getElementsByClassName('input__auth');
        if (fields.length !== 5) {
            throw Error
        }
        if (fields[3].value !== fields[4].value) {
            // todo: handle error
            console.log('Passwords must be equal');
            return
        }
        let form = {
            name: fields[0].value,
            email: fields[1].value,
            phone: fields[2].value,
            password: fields[3].value,
        };
        console.log(form);

        // Ajax.send(form);
        window.history.pushState({}, '', '/profile');
        window.history.pushState({}, '', '/profile');
        window.history.back();
    }
}