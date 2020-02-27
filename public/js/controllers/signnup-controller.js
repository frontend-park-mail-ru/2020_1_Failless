'use strict';

import Controller from '../core/controller.js';
import SignUpView from '../views/singup-view.js';
import UserModel from '../models/user-model.js';

export default class SignUpController extends Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new SignUpView(parent);
        this.events = [];
    }

    /* [HIGH-PRIORITY] TODO Пиздос с routerInstance надо перепроектировать ASAP 
     * (быдлокод тянется на this.events & _signUpHandler)
    */
    action(routerInstance) {
        this.parent.innerHTML = "";
        this.view.render();

        const signUp = document.getElementsByClassName('btn btn_color_ok btn_size_large')[0];
        signUp.addEventListener('click', this._signUpHandler.bind(this));

        const loginRedirect = document.getElementsByClassName('btn__text btn__text_b')[0];
        loginRedirect.addEventListener('click', this._loginRedirect.bind(this));

        this.events.push(
            {item: signUp, type: 'click', handler: this._signUpHandler.bind(this), router: routerInstance},
            {item: loginRedirect, type: 'click', handler: this._loginRedirect.bind(this), router: routerInstance},
        );
    }

    // [HIGH-PRIORITY] TODO Добавить валидацию на пароль и прочий мусор

    /**
     * Get data from input form on sign up page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromSignUp(event) {
        const form = document.getElementsByClassName('auth__item auth__item_main')[0].getElementsByClassName('auth__input');

        const userName = form[0].getElementsByClassName('input input__auth')[0].value;
        const userEmail = form[1].getElementsByClassName('input input__auth')[0].value;
        const userPhone = form[2].getElementsByClassName('input input__auth')[0].value;
        const userPass = form[3].getElementsByClassName('input input__auth')[0].value;
        const userPassAgain = form[4].getElementsByClassName('input input__auth')[0].value;

        return {userName, userPass, userPhone, userEmail};
    }

    // [HIGH-PRIORITY] TODO Половина функции - костыли и говно
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
                this.events[0].router.route();
            } else {
                console.log('Client error, stay here');
            }
        });
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginRedirect(event) {
        event.preventDefault();
        
        document.getElementsByClassName('auth')[0].remove();
        window.history.pushState({}, '', '/login');
        this.events[1].router.route();
    }
}