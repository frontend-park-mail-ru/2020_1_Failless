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
        this.resultsArea = null;
    }

    /**
     * Render template
     * @param {JSON} events
     */
    render(events) {
        const search = {
            events: events,
        };
        const template = Handlebars.templates['big-search'](search);
        this.parent.insertAdjacentHTML('beforeend', template);
        this.resultsArea = document.getElementsByClassName('big-search__grid')[0];
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
                    date: '15 марта 2020 19:30',
                    followInfo: '1000',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Играем в футбол на Водном',
                    description: '«Буерак» стали одной из тотемных групп набиравшего обороты нового русского инди-рока. Выпуская по альбому в год (четвёртый, «Шоу-бизнес», вышел минувшей осенью), дуэт Артёма Черепанова и Александра Макеева изобрёл себя вновь уже не раз - и едва ли остановится на достигнутом.',
                    followInfo: '3/18',
                    date: '15 марта 2020 19:30',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    date: '15 марта 2020 19:30',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    date: '15 марта 2020 19:30',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    date: '15 марта 2020 19:30',
                    middle: true,
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    date: '15 марта 2020 19:30',
                    middle: true,
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/lead.jpg',
                    eventName: 'middle/' + '1',
                    title: 'Мафия',
                    description: 'Хотим выйти чисто отдохнуть',
                    followInfo: '5/6',
                    middle: true,
                    date: '15 марта 2020 19:30',
                },
                {
                    img: 'img/default.png',
                    eventName: 'middle/' + '1',
                    title: 'Выставка Дали',
                    description: 'Впервые в Москве выставка более двухсот работ гениального автора',
                    followInfo: '11232',
                    date: '15 марта 2020 19:30',
                }
            ],
        };
        const template = Handlebars.templates['big-search'](search);
        this.parent.insertAdjacentHTML('beforeend', template);
    };

    renderResults(results) {
        if (this.resultsArea) {
            this.resultsArea.innerHTML = '';
        }
        this.appendResults(results);
    }

    appendResults(events) {
        let template = '';
        events.forEach(event => {
            template += Handlebars.templates['big-event'](event);
        });

        this.resultsArea.insertAdjacentHTML('beforeend', template);
    }
}
