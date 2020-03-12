'use strict';

import View from '../core/view.js';

/**
 * @class create LoginView class
 */
export default class LoginView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    /**
     * Render template
     */
    render() {
        // const login = Handlebars.templates['auth']({
        //     blocks: [
        //         {
        //             main: true,
        //             title: 'Вход',
        //             fields: [
        //                 {
        //                     name: 'Телефон или Email',
        //                     help: 'me@example.com',
        //                     type: 'text',
        //                 },
        //                 {
        //                     name: 'Пароль',
        //                     help: '******',
        //                     type: 'password',
        //                 }
        //             ],
        //             button: 'Войти',
        //         },
        //         {
        //             main: false,
        //             title: 'Регистрация',
        //             help: 'Ещё нет аккаунта? Пора его завести!',
        //             button: 'Зарегистрироваться',
        //         },
        //     ],
        // });
        //
        // this.parent.insertAdjacentHTML('beforeend', login);
        this.parent.innerHTML += Handlebars.templates['public/js/templates/login-template']()
    }
}