'use strict';

/**
 * Draw header
 * @param {HTMLElement} base
 */
export default function createHeader(base, logged) {
    if (document.getElementsByClassName('header').length !== 0) {
        document.getElementsByClassName('header')[0].remove();
    }

    const header = Handlebars.templates['header'](
        {
            logo: '/static/images/logo.png',
            buttons: !logged ? [
                {
                    link: '/search',
                    name: 'Поиск',
                },
                {
                    link: '/signup',
                    name: 'Регистрация',
                },
                {
                    link: '/login',
                    name: 'Войти',
                },
            ] : [
                {
                    link: '/search',
                    name: 'Поиск',
                },
                {
                    link: '/feed/users',
                    name: 'Лента',
                },
                {
                    link: '/my/profile',
                    name: 'Профиль',
                },
            ]
        });

    base.insertAdjacentHTML('afterbegin', header);
}