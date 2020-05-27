'use strict';

import View from 'Eventum/core/view.js';
import landingTemplate from 'Components/landing/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

/**
 * @class create LandingView class
 */
export default class LandingView extends View {

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
     * @param {boolean} isAuth
     */
    render(isAuth = false) {
        const landing = landingTemplate({
            auth: isAuth,
            creators: [
                {
                    name: 'Андрей',
                    about: 'Написал всё <br>Вообще всё,<br> что работает и не работает',
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Andrey.jpg',
                    links: {
                        github: 'https://github.com/rowbotman',
                        vk: 'https://vk.com/mannobody2',
                        tg: 'https://t.me/RMAttack',
                    },
                },
                {
                    name: 'Егор',
                    // eslint-disable-next-line no-irregular-whitespace
                    about: `Нарисовал всё <br>Вообще всё, <br>что красиво и не красиво`,
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Egor.jpg',
                    links: {
                        github: 'https://github.com/EgorBedov',
                        vk: 'https://vk.com/egogoger',
                        tg: 'https://t.me/egogoger',
                    },
                },
                {
                    name: 'Сергей',
                    // eslint-disable-next-line no-irregular-whitespace
                    about: `Человек слова &laquoПринял!&raquo<br> Исправит всё,<br>что работает и не работает`,
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Sergey.jpeg',
                    links: {
                        github: 'https://github.com/almashell',
                        vk: '',
                        tg: 'https://t.me/AlmaShell',
                    },
                },
            ],
            mentors: [
                {
                    name: 'Лиза',
                    about: 'Ментор по фронту',
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Lisa.jpg',
                    links: {
                        github: 'https://github.com/Betchika99',
                        vk: '',
                        tg: 'https://t.me/Betchika99',
                    },
                },
                {
                    name: 'Вова',
                    about: 'Ментор по беку',
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Vova.jpg',
                    links: {
                        github: 'https://github.com/hackallcode',
                        vk: '',
                        tg: 'https://t.me/hackallcode',
                    },
                },
            ],
            MOTTO: TextConstants.LANDING__MOTTO,
            MAIN_DESCRIPTION: TextConstants.LANDING__MAIN_DESCRIPTION,
            AUTHED_MSG: TextConstants.LANDING__AUTHED_MSG,
            SCREEN1_TITLE: TextConstants.LANDING__SCREEN1_TITLE,
            LANDING__SCREEN1_1: TextConstants.LANDING__SCREEN1_1,
            LANDING__SCREEN1_2: TextConstants.LANDING__SCREEN1_2,
            LANDING__SCREEN1_3: TextConstants.LANDING__SCREEN1_3,
            LANDING__SCREEN1_4: TextConstants.LANDING__SCREEN1_4,
            SCREEN2_TITLE: TextConstants.LANDING__SCREEN2_TITLE,
            SHORT_DESCRIPTION: TextConstants.LANDING__SHORT_DESCRIPTION,
            JOIN: TextConstants.BASIC__JOIN,
            REPOS: TextConstants.BASIC__REPOS,
            PREV_WORKS: TextConstants.LANDING__PREV_WORKS,
            MOBILE_APPS: TextConstants.LANDING__MOBILE_APPS,
            RIGHTS: TextConstants.LANDING__RIGHTS,
            REPO: TextConstants.BASIC__REPO,
        });
        this.parent.insertAdjacentHTML('beforeend', landing);
    }
}