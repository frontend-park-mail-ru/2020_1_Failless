'use strict';

import View from 'Eventum/core/view.js';

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
            style: 'font-size: 33px;',
            input: [
                {
                    title: 'Имя',
                    type: 'text',
                    placeholder: 'Илья',
                    autocomplete: 'name',
                    name: 'name',
                    others: ['required', 'autofocus', 'signup'],
                },
                {
                    title: 'Email',
                    type: 'email',
                    name: 'email',
                    autocomplete: 'email',
                    placeholder: 'ilya@mail.com',
                },
                {
                    title: 'Телефон',
                    type: 'tel',
                    autocomplete: 'tel',
                    name: 'phone',
                    placeholder: '+7 (800) 555-35-35',
                    others: ['required'],
                },
                {
                    title: 'Пароль',
                    type: 'password',
                    name: 'password',
                    placeholder: '*******',
                    others: ['required'],
                },
                {
                    title: 'Повторите пароль',
                    type: 'password',
                    name: 'passwordC',
                    placeholder: '*******',
                    others: ['required', 'second_password'],
                },
            ],
            button: 'Зарегистрироваться',
        });
    }
}