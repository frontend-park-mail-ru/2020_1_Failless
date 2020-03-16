'use strict';

import View from '../core/view.js';

/**
 * @class create SearchView class
 */
export default class BigEventSearchView extends View {

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
     * @param {JSON} events
     */
    render(events) {
        if (!events) {
            this.#renderEmptySearch();
        } else {
            this.renderResults(events);
        }
    }

    #renderEmptySearch = () => {
        console.log(' I am alive');
        const search = {
            events: [
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Концерт Буерак',
                    description: '«Буерак» стали одной из тотемных групп набиравшего обороты нового русского инди-рока. Выпуская по альбому в год (четвёртый, «Шоу-бизнес», вышел минувшей осенью), дуэт Артёма Черепанова и Александра Макеева изобрёл себя вновь уже не раз - и едва ли остановится на достигнутом.',
                    date: '15 марта 2020 19:30',
                    followInfo: '100',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Концерт Федук',
                    description: 'Дуэт Артёма Черепанова и Александра Макеева изобрёл себя вновь уже не раз - и едва ли остановится на достигнутом.',
                    followInfo: '1000',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Играем в футбол на Водном',
                    description: '«Буерак» стали одной из тотемных групп набиравшего обороты нового русского инди-рока. Выпуская по альбому в год (четвёртый, «Шоу-бизнес», вышел минувшей осенью), дуэт Артёма Черепанова и Александра Макеева изобрёл себя вновь уже не раз - и едва ли остановится на достигнутом.',
                    followInfo: '3/18',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                }
            ],
        };
        const template = Handlebars.templates['big-search'](search);
        this.parent.insertAdjacentHTML('beforeend', template);
    };

    renderResults(results) {
        const search = {};
        const template = Handlebars.templates['big-search'](search);
        this.parent.insertAdjacentHTML('beforeend', template);
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
        ['/EventPhotos/3.jpg', '/EventPhotos/4.jpg'],
        'Концерт',
        'Москва',
        'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'),
    new Event(
        ['/EventPhotos/2.jpg', '/EventPhotos/1.jpg'],
        'Выставка',
        'Ленинград',
        'Выставка Ван-Гога. Обещают привезти главный экспонат')
];

function Tag(title) {
    this.title = '#' + title;
}

const tags = [
    new Tag('хочувБАР'),
    new Tag('хочувКИНО'),
    new Tag('хочунаКАТОК'),
    new Tag('хочуГУЛЯТЬ'),
    new Tag('хочуКУШАЦ'),
    new Tag('хочуСПАТЬ'),
];
