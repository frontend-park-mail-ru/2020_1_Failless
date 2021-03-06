'use strict';

import View from 'Eventum/core/view.js';
import authTemplate from 'Components/auth/template.hbs';

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

    destructor() {
    }

    /**
     * Render template
     */
    render() {
        this.parent.innerHTML += authTemplate({
            data_bind: 'login',
            title: 'ВХОД',
            input: [
                {
                    title: 'Телефон или Email',
                    type: 'text',
                    placeholder: 'me@example.com',
                    others: ['required', 'autofocus', 'login'],
                },
                {
                    title: 'Пароль',
                    type: 'password',
                    placeholder: '*******',
                    others: ['required'],
                },
            ],
            button: 'Вход',
        });
    }
}