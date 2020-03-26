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
                // {
                //     link: '/search',
                //     name: 'Поиск',
                // },
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
                // TODO: Move Выход to my/profile somewhere
                {
                    link: '/logout',
                    name: 'Выход',
                },
                {
                    link: '/profile',
                    name: 'Профиль',
                },
            ]
        });

    base.insertAdjacentHTML('afterbegin', header);
}