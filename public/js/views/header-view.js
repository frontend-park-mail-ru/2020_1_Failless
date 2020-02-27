'use strict';

import View from '../core/view.js';

/**
 *
 */
export default class HeaderView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    // TODO Переписать эту блевотину
    render() {
        const template = [
            {
                block: 'header',
                tag: 'nav',
                content: [
                    {
                        block: 'image',
                        tag: 'img',
                        url: './static/images/logo.png',
                        mix: {'block': 'icon_btn icon__size_m header__item'},
                        attrs: { src: './static/images/logo.png', alt: 'Eventum' }
                    },
                    {
                        block: 'header__manage',
                        content: [
                            {
                                block: 'header__item',
                                tag: 'a',
                                attrs: { href: '/search' },
                                content: 'Поиск'
                            },
                            {
                                block: 'header__item',
                                tag: 'a',
                                attrs: { href: '/reg' },
                                content: 'Рега'
                            },
                            {
                                block: 'header__item',
                                tag: 'a',
                                attrs: { href: '/login' },
                                content: 'Войти'
                            },
                            {
                                block: 'header__item',
                                tag: 'a',
                                attrs: { href: '/profile' },
                                content: 'Профиль'
                            },
                        ]   
                    }
                ]
            }
        ];
        this.parent.insertAdjacentHTML('beforebegin', bemhtml.apply(template));
    }
}