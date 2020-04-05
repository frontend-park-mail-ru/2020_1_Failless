'use strict';

import View from 'Eventum/core/view.js';
import authTemplate from 'Components/auth/template.hbs';

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
        this.parent.innerHTML += authTemplate({
            title: 'РЕГИСТРАЦИЯ',
            title_style: 'auth__title__reg',
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