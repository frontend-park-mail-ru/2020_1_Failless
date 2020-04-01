'use strict';

import View from '../core/view.js';
import {tags, events} from '../utils/static-data.js';

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
     */
    render() {
        const profile = {
            name: 'Egor',
            age: 20,
            about: 'Поскольку тут контент динамический, то будет max-height, примерно как сейчас. ' +
                'Будет expand поверх фотки Соответственно кнопки посередине оставшегося ' +
                'блока снизу padding: 15px; // везде',
            photos: ['1.jpg'],
            tags: tags,
        };

        const template = {
            tags: tags,
            profile: profile,
            events: events,
            isEvents: false,
        };

        this.parent.innerHTML += Handlebars.templates['feed'](template);
        // let columns = this.parent.getElementsByClassName('feed__column');
        // columns[1].innerHTML = Handlebars.templates['feed-center']({profile: profile});
        // columns[2].innerHTML = Handlebars.templates['feed-right']({events: events});
    }
}
