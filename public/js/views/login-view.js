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
        const template = [
            {
                block: 'auth',
                content: [
                    {
                        elem: 'item',
                        mix: {block: 'auth__item_main'},
                        content: [
                            {
                                elem: 'title',
                                mix: {block: 'auth__title_main'},
                                content: 'Вход',
                            },
                            {
                                elem: 'smth',
                                attrs: {id: 'form'},
                                tag: 'form',
                                content: [
                                    {
                                        elem: 'input',
                                        content: [
                                            {
                                                elem: 'help',
                                                content: 'Email',
                                            },
                                            {
                                                block: 'input',
                                                mix: {'block': 'input__auth'},
                                                tag: 'input',
                                                attrs: {placeholder: 'me@example.com', type: 'email'},
                                            },
                                        ]
                                    },
                                    {
                                        elem: 'input',
                                        content: [
                                            {
                                                elem: 'help',
                                                content: 'Password',
                                            },
                                            {
                                                block: 'input',
                                                mix: {'block': 'input__auth'},
                                                tag: 'input',
                                                attrs: {placeholder: '*******', type: 'password'},
                                            },
                                        ]
                                    },
                                    {
                                        elem: 'btn',
                                        content: [{
                                            block: 'btn',
                                            mods: {color: 'ok', size: 'middle'},
                                            btnText: 'Войти',
                                            attrs: {type: 'submit'},
                                        }],
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        elem: 'item',
                        content: [
                            {
                                elem: 'title',
                                content: 'Регистрация',
                            },
                            {
                                elem: 'text',
                                content: 'Ещё нет аккаунта? Пора его завести!',
                            },
                            {
                                elem: 'btn',
                                content: [{
                                    block: 'btn',
                                    mods: {color: 'w', size: 'large'},
                                    btnText: 'Зарегистриророваться',
                                    color: 'blue',
                                    attrs: {type: 'submit'},
                                }],
                            }
                        ],
                    }
                ]
            }
        ];
        this.parent.insertAdjacentHTML('beforeend', bemhtml.apply(template));
    }
}