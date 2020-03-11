'use strict';

import View from '../core/view.js';
import settings from '../../settings/config.js';

const tagNames = ['#хочувБАР', '#хочувКИНО', '#хочунаКАТОК', '#хочуГУЛЯТЬ', '#хочуКУШАЦ', '#хочуСПАТЬ'];

/**
 *
 */
export default class ProfileView extends View {

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
     * @param {JSON} profile -  user profile from server
     */
    render(profile) {
        let allowEdit = true;
        const profileTemplate = Handlebars.templates['profile']({
            username: profile.name,
            title1: 'О себе',
            textarea: {
                help: 'Расскажите о себе и своих увлечениях',
                about: profile.about,
            },
            edit: allowEdit,
            buttonOk: 'Готово',
            buttonSettings: 'Настройки',
            title2: 'Фото',
            img: settings.img + profile.avatar.path,
            title3: 'Ваши тэги',
            tags: tagNames,
            title4: 'Ваши мероприятия',
            events: [
                {
                    photos: [
                        'EventPhotos/3.jpg',
                        'EventPhotos/4.jpg',
                    ],
                    title: 'Концерт',
                    place: 'Москва',
                    description: 'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'
                }
            ],
        });


        this.parent.insertAdjacentHTML('beforeend', profileTemplate);
    }
}