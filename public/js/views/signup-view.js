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
        this.parent.innerHTML += Handlebars.templates['auth']({
            title: 'РЕГИСТРАЦИЯ',
            title_style: 'auth__title__reg',
            input: [
                {
                    title: 'Имя',
                    type: 'text',
                    placeholder: 'Илья',
                    others: ['required', 'autofocus', 'signup'],
                },
                {
                    title: 'Email',
                    type: 'email',
                    placeholder: 'ilya@mail.com',
                },
                {
                    title: 'Телефон',
                    type: 'tel',
                    placeholder: '+7 (800) 555-35-35',
                    others: ['required'],
                },
                {
                    title: 'Пароль',
                    type: 'password',
                    placeholder: '*******',
                    others: ['required'],
                },
                {
                    title: 'Повторите пароль',
                    type: 'password',
                    placeholder: '*******',
                    others: ['required', 'second_password'],
                },
            ],
            button: 'Зарегистрироваться',
        });
    }
}