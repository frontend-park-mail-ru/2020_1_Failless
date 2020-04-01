'use strict';

import View from '../core/view.js';
import {tags, events} from '../utils/static-data.js';
import getPageUrl from '../utils/get-img-url.js';

/**
 * @class create SearchView class
 */
export default class FeedUsersView extends View {

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
     * @param {Object} data
     * @param {Array} selectedTags
     * @param {boolean} isEvent
     */
    render(data, selectedTags, isEvent) {
        const profile = {
            name: 'Egor',
            age: 20,
            about: 'Поскольку тут контент динамический, то будет max-height, примерно как сейчас. ' +
                'Будет expand поверх фотки Соответственно кнопки посередине оставшегося ' +
                'блока снизу padding: 15px; // везде',
            photos: ['1.jpg'],
            tags: tags,
        };
        if (data.photos !== null) {
            if (isEvent) {
                data.photos.forEach((item) => getPageUrl(item, 'events'));
            } else {
                data.photos.forEach((item) => getPageUrl(item, 'users'));
            }
        } else {
            data.photos = [getPageUrl('default.png', 'events')];
        }

        const template = {
            tags: tags,
            data: data,
            isEvent: isEvent,
            users: null,  // TODO: take it by AJAX
            events: null, // TODO: take it by AJAX
        };
        console.log(data);

        this.parent.innerHTML += Handlebars.templates['feed'](template);
        // let columns = this.parent.getElementsByClassName('feed__column');
        // columns[1].innerHTML = Handlebars.templates['feed-center']({profile: profile});
        // columns[2].innerHTML = Handlebars.templates['feed-right']({events: events});
    }
}
