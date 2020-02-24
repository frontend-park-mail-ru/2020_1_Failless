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
                                content: 'Регистрация',
                            },
                            {
                                elem: 'input',
                                content: [
                                    {
                                        elem: 'help',
                                        content: 'Имя',
                                    },
                                    {
                                        block: 'input',
                                        mix: {'block': 'input__auth'},
                                        tag: 'input',
                                        attrs: {placeholder: 'Илья', type: 'text'},
                                    },
                                ]
                            },
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
                                        attrs: {placeholder: 'ilya@mail.com', type: 'email'},
                                    },
                                ]
                            },
                            {
                                elem: 'input',
                                content: [
                                    {
                                        elem: 'help',
                                        content: 'Телефон',
                                    },
                                    {
                                        block: 'input',
                                        mix: {'block': 'input__auth'},
                                        tag: 'input',
                                        attrs: {type: 'tel'},
                                    },
                                ]
                            },
                            {
                                elem: 'input',
                                content: [
                                    {
                                        elem: 'help',
                                        content: 'Пароль',
                                    },
                                    {
                                        block: 'input',
                                        mix: {'block': 'input__auth'},
                                        tag: 'input',
                                        attrs: {placeholder: 'password', type: 'password'},
                                    },
                                ]
                            },
                            {
                                elem: 'input',
                                content: [
                                    {
                                        elem: 'help',
                                        content: 'Повтороите пароль',
                                    },
                                    {
                                        block: 'input',
                                        mix: {'block': 'input__auth'},
                                        tag: 'input',
                                        attrs: {placeholder: 'password', type: 'password'},
                                    },
                                ]
                            },
                            {
                                elem: 'btn',
                                content: [{
                                    block: 'btn',
                                    mods: {color: 'muted', size: 'large'},
                                    btnText: 'Зарегестриророваться',
                                    attrs: {type: 'submit'},
                                }],
                            }
                        ],
                    },
                    {
                        elem: 'item',
                        content: [
                            {
                                elem: 'title',
                                content: 'Вход',
                            },
                            {
                                elem: 'text',
                                content: 'Уже зарегистрированы?\n' +
                                    'Войдите с существующим аккаунтом!',
                            },
                            {
                                elem: 'btn',
                                content: [{
                                    block: 'btn',
                                    mods: {color: 'muted', size: 'middle'},
                                    btnText: 'Войти',
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