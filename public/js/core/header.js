'use strict';

/**
 * Draw header
 * @param {HTMLElement} base
 */
export default function createHeader(base, logged) {
    if (document.getElementsByClassName('header').length !== 0) {
        document.getElementsByClassName('header')[0].remove();
    }

    let template = !logged ? [
        {
            block: 'header',
            tag: 'nav',
            content: [
                {
                    block: 'image',
                    tag: 'img',
                    url: './static/images/logo.png',
                    mix: {'block': 'icon_btn icon__size_m header__item'},
                    attrs: {src: './static/images/logo.png', alt: 'Eventum'}
                },
                {
                    block: 'header__manage',
                    content: [
                        {
                            block: 'header__item',
                            tag: 'a',
                            attrs: {href: '/signup'},
                            content: 'Рега'
                        },
                        {
                            block: 'header__item',
                            tag: 'a',
                            attrs: {href: '/login'},
                            content: 'Войти'
                        }
                    ]
                }
            ]
        }
    ] : [
        {
            block: 'header',
            tag: 'nav',
            content: [
                {
                    block: 'image',
                    tag: 'img',
                    url: './static/images/logo.png',
                    mix: {'block': 'icon_btn icon__size_m header__item'},
                    attrs: {src: './static/images/logo.png', alt: 'Eventum'}
                },
                {
                    block: 'header__manage',
                    content: [
                        {
                            block: 'header__item',
                            tag: 'a',
                            attrs: {href: '/search'},
                            content: 'Поиск'
                        }
                        ,
                        {
                            block: 'header__item',
                            tag: 'a',
                            attrs: {href: '/logout'},
                            content: 'Выйти'
                        },
                        {
                            block: 'header__item',
                            tag: 'a',
                            attrs: {href: '/profile'},
                            content: 'Профиль'
                        },
                    ]
                }
            ]
        }
    ];

    base.insertAdjacentHTML('afterbegin', bemhtml.apply(template));
}