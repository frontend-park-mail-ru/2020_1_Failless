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
        this.parent.innerHTML += Handlebars.templates['auth']({
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