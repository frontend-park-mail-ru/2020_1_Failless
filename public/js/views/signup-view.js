'use strict';

import View from 'Eventum/core/view.js';
import authTemplate from 'Components/auth/template.hbs';
import errorTemplate from 'Blocks/validation-error/template.hbs';

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

    /**
     * Add error message
     * @param {HTMLElement} element - html element
     * @param {string[]} messageValue - array of validation errors
     */
    addErrorMessage(element, messageValue) {
        if (messageValue.length === 0) {
            return;
        }

        element.classList.add('input__auth_incorrect');
        element.insertAdjacentHTML('beforebegin', errorTemplate({message: messageValue[0]}));
    }
}