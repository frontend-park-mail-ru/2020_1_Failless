'use strict';

import Controller from '../core/controller.js';
import LoginView from '../views/login-view.js';
import UserModel from '../models/user-model.js';

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
        this.events = [];
    }

    /* [HIGH-PRIORITY] TODO Пиздос с routerInstance надо перепроектировать ASAP 
     * (быдлокод тянется на this.events & _loginHandler)
     */
    action(routerInstance) {
        this.parent.innerHTML = "";
        this.view.render();

        const login = document.getElementsByClassName('btn__text btn__text_w')[0];
        login.addEventListener('click', this._loginHandler.bind(this));

        const signUpRedirect = document.getElementsByClassName('btn__text btn__text_b')[0];
        signUpRedirect.addEventListener('click', this._signUpRedirect.bind(this));

        this.events.push(
            {item: login, type: 'click', handler: this._loginHandler.bind(this), router: routerInstance},
            {item: signUpRedirect, type: 'click', handler: this._signUpRedirect.bind(this), router: routerInstance},
        );
    }

    // [HIGH-PRIORITY] TODO Добавить валидацию на пароль и прочий мусор

    /**
     * Get data from input form on login page
     * @param {event} event
     * @return {Object} input form
     */
    _getFromLogin(event) {
        // const form = document.getElementById('form');

        const form = document.getElementsByClassName('auth__item auth__item_main')[0].getElementsByClassName('auth__input');

        const userEmail = form[0].getElementsByClassName('input input__auth')[0].value;
        const userPass = form[1].getElementsByClassName('input input__auth')[0].value;

        return {userEmail, userPass};
    }

    // [HIGH-PRIORITY] TODO Половина функции - костыли и говно
    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginHandler(event) {
        event.preventDefault();

        const body = this._getFromLogin(event);

        UserModel.postLogin(body).then((ok) => {
            if (ok) {
                document.getElementsByClassName('auth')[0].remove();
                window.history.pushState({}, '', '/profile');
                this.events[0].router.route();
                console.log(document.cookie);
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
    _signUpRedirect(event) {
        event.preventDefault();
        
        document.getElementsByClassName('auth')[0].remove();
        window.history.pushState({}, '', '/signup');
        this.events[1].router.route();
    }
}