'use strict';

import View from '../core/view.js';

let profilePhotos = ['ProfilePhotos/1.jpg', 'ProfilePhotos/2.jpg', 'ProfilePhotos/3.jpg'];
const getBlocks = (profilePhotos) => {
    let blocks = [];
    profilePhotos.forEach(elem => {
        blocks.push({
            block: 'profile',
            elem: 'photo',
            mods: {'me': true},
            tag: 'img',
            attrs: {src: '' + elem}
        });
    });
    return blocks;
};

const tagNames = ['#хочувБАР', '#хочувКИНО', '#хочунаКАТОК', '#хочуГУЛЯТЬ', '#хочуКУШАЦ', '#хочуСПАТЬ'];

const getTags = (tagNames) => {
    let blocks = [];
    tagNames.forEach(elem => {
        blocks.push({
            block: 'tag',
            mods: {'size': 'middle'},
            content: elem,
        });
    });
    return blocks;
};

const eventPhotos = ['EventPhotos/3.jpg', 'EventPhotos/4.jpg'];
const getEventPhotos = (eventPhotos) => {
    let blocks = [];
    eventPhotos.forEach((elem) => {
        blocks.push({
            elem: 'item',
            mix: {block: 'event__item', mods: {'one': true}},
            tag: 'img',
            attrs: {src: elem}
        });
    });
    return blocks;
};
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
        let allowEdit = true;
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