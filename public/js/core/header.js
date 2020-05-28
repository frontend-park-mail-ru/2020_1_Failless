'use strict';

import headerTemplate from 'Blocks/header/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

/**
 * Draw header
 * @param {HTMLElement} base
 * @param {boolean} logged - is user auth
 */
export default function createHeader(base, logged) {
    if (document.getElementsByClassName('header').length !== 0) {
        document.getElementsByClassName('header')[0].remove();
    }

    const header = headerTemplate(
        {
            buttons: !logged ? [
                {
                    link: '/search',
                    name: TextConstants.BASIC__EVENTS,
                },
                {
                    link: '/signup',
                    name: TextConstants.BASIC__SIGNUP,
                },
                {
                    link: '/login',
                    name: TextConstants.BASIC__LOGIN,
                },
                {
                    link: '#!',
                    name: TextConstants.BASIC__SETTINGS,
                    sub_buttons: {

                    }
                },
            ] : [
                {
                    link: '/search',
                    name: TextConstants.BASIC__EVENTS,
                },
                {
                    link: '/feed',
                    name: TextConstants.BASIC__SEARCH,
                },
                {
                    link: '/my/profile',
                    name: TextConstants.BASIC__PROFILE,
                },
            ],
        });

    base.insertAdjacentHTML('afterbegin', header);
}