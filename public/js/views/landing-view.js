'use strict';

import View from 'Eventum/core/view';
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
            events: [
                {
                    type: 'small',
                    title: TextConstants.LANDING__SMALL_EVENT_TITLE,
                    description: TextConstants.LANDING__SMALL_EVENT_DESCRIPTION,
                    photo: TextConstants.LANDING__SMALL_EVENT_PHOTO,
                },
                {
                    type: 'mid',
                    title: TextConstants.LANDING__MID_EVENT_TITLE,
                    description: TextConstants.LANDING__MID_EVENT_DESCRIPTION,
                    photo: TextConstants.LANDING__MID_EVENT_PHOTO,
                },
                {
                    type: 'big',
                    title: TextConstants.LANDING__BIG_EVENT_TITLE,
                    description: TextConstants.LANDING__BIG_EVENT_DESCRIPTION,
                    photo: TextConstants.LANDING__BIG_EVENT_PHOTO,
                },
            ],
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
                    about: 'Нарисовал всё <br>Вообще всё, <br>что красиво и не красиво',
                    avatar: 'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Egor.jpg',
                    links: {
                        github: 'https://github.com/EgorBedov',
                        vk: 'https://vk.com/egogoger',
                        tg: 'https://t.me/egogoger',
                    },
                },
                {
                    name: 'Сергей',
                    about: 'Человек слова &laquoПринял!&raquo<br> Исправит всё,<br>что работает и не работает',
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
        });
        this.parent.insertAdjacentHTML('beforeend', landing);
    }
}