'use strict';

import View from '../core/view.js';

/**
 *
 */
export default class SignUpView extends View {

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
        // const signup = Handlebars.templates['auth']({
        //     blocks: [
        //         {
        //             main: true,
        //             title: 'Регистрация',
        //             fields: [
        //                 {
        //                     name: 'Имя',
        //                     help: 'Илья',
        //                     type: 'text',
        //                 },
        //                 {
        //                     name: 'Email',
        //                     help: 'ilya@mail.com',
        //                     type: 'email',
        //                 },
        //                 {
        //                     name: 'Телефон',
        //                     help: '+7 (999) 555-35-35',
        //                     type: 'tel',
        //                 },
        //                 {
        //                     name: 'Пароль',
        //                     help: '******',
        //                     type: 'password',
        //                 },
        //                 {
        //                     name: 'Повторите пароль',
        //                     help: '******',
        //                     type: 'password',
        //                 }
        //             ],
        //             button: 'Зарегистрироваться',
        //         },
        //         {
        //             main: false,
        //             title: 'Вход',
        //             help: 'Уже зарегистрированы? Войдите с существующим аккаунтом!',
        //             button: 'Войти',
        //         },
        //     ],
        // });
        //
        // this.parent.insertAdjacentHTML('beforeend', signup);
        this.parent.innerHTML += Handlebars.templates['public/js/templates/signup-template']()
    }
}