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
     * @param {{birthday: string, password: string, gender: string, phone: string, name: string, about: string, rating: string, location: string, avatar: string, photos: string, email: string}} profile -  user profile from server
     */
    render(profile) {
        console.log(profile);
        // let allowEdit = true;
        // const profileTemplate = Handlebars.templates['profile']({
        //     username: profile.name,
        //     title1: 'О себе',
        //     textarea: {
        //         help: 'Расскажите о себе и своих увлечениях',
        //         about: profile.about,
        //     },
        //     edit: allowEdit,
        //     buttonOk: 'Готово',
        //     buttonSettings: 'Настройки',
        //     title2: 'Фото',
        //     img: settings.img + profile.avatar.path,
        //     title3: 'Ваши тэги',
        //     tags: tagNames,
        //     title4: 'Ваши мероприятия',
        //     events: [
        //         {
        //             photos: [
        //                 'EventPhotos/3.jpg',
        //                 'EventPhotos/4.jpg',
        //             ],
        //             title: 'Концерт',
        //             place: 'Москва',
        //             description: 'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'
        //         }
        //     ],
        // });
        //
        //
        // this.parent.insertAdjacentHTML('beforeend', profileTemplate);
        // TODO: add events to profile
        this.parent.innerHTML += Handlebars.templates['public/js/templates/profile-template']({profile: profile, events: events});
        this.parent.innerHTML += Handlebars.templates['public/js/templates/settings-template']({profile: profile});
        this.parent.innerHTML += Handlebars.templates['public/js/templates/set-event-template']({events: events, mode: "Изменить"});
    }
}

function Event(photos, title, place, description) {
    this.photos = photos;
    this.title = title;
    this.place = place;
    this.description = description;
}

const events = [
    new Event(
        ['EventPhotos/3.jpg', 'EventPhotos/4.jpg'],
        'Концерт',
        'Москва',
        'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'),
    new Event(
        ['EventPhotos/2.jpg', 'EventPhotos/1.jpg'],
        'Выставка',
        'Ленинград',
        'Выставка Ван-Гога. Обещают привезти главный экспонат')
];