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
            style: 'font-size: 33px;',
            input: [
                {
                    title: 'Имя',
                    type: 'text',
                    placeholder: 'Илья',
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
                },
                {
                    title: 'Пароль',
                    type: 'password',
                    placeholder: '*******',
                },
                {
                    title: 'Повторите пароль',
                    type: 'password',
                    placeholder: '*******',
                },
            ],
            button: 'Зарегистрироваться',
        });
    }
}