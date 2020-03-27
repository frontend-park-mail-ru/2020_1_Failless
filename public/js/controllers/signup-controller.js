'use strict';

import Controller from '../core/controller.js';
import SignUpView from '../views/signup-view.js';
import UserModel from '../models/user-model.js';
import ValidationModule from '../utils/validation.js'

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
        form.addEventListener('submit', this._signUpSubmitHandler.bind(this));
        form.addEventListener('input', this._signUpInputHandler.bind(this));
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
        const repeatPassword = form[4].value;

        console.log(ValidationModule.validateUserData(
            {name, email, phone, password, repeatPassword}, 
            ['name', 'email', 'phone', 'password', 'repeatPassword']
        ));
        if (ValidationModule.validateUserData(
            {name, email, phone, password, repeatPassword}, 
            ['name', 'email', 'phone', 'password', 'repeatPassword']
        ).some(val => val.length !== 0)) {
            return null;
        }

        return {name, password, phone, email};
    }

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    _signUpSubmitHandler(event) {
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

    _addErrorMessage(element, messageValue) {
        element.insertAdjacentHTML('afterend', 
            Handlebars.templates['validation-error']({message: messageValue}));
    }

    /**
     * Handle click on submit event
     * @param {Event} event
     */
    _signUpInputHandler(event) {
        const form = document.getElementById('form').getElementsByClassName('input input__auth');

        const name = form[0].value;
        const email = form[1].value;
        const phone = form[2].value;
        const password = form[3].value;
        const repeatPassword = form[4].value;

        let errors = document.getElementsByClassName('validation-error');
        while(errors.length > 0){
            errors[0].parentNode.removeChild(errors[0]);
        }

        switch(true) {
            case (event.target === form[0]):
                const nameCheck = ValidationModule.validateUserData({name}, ['name']);
                this._addErrorMessage(form[0], nameCheck);
                break;
            case (event.target === form[1]):
                const emailCheck = ValidationModule.validateUserData({email}, ['email']);
                this._addErrorMessage(form[1], emailCheck);
                break;
            case (event.target === form[2]):
                const phoneCheck = ValidationModule.validateUserData({phone}, ['phone']);
                this._addErrorMessage(form[2], phoneCheck);
                break;
            case (event.target === form[3]):
                const passwordCheck = ValidationModule.validateUserData({password}, ['password']);
                this._addErrorMessage(form[3], passwordCheck);
                break;
            case (event.target === form[4]):
                const repeatPasswordCheck = ValidationModule.validateUserData({password, repeatPassword}, ['password', 'repeatPassword']);
                this._addErrorMessage(form[4], repeatPasswordCheck);
                break;
        }
    }
}
