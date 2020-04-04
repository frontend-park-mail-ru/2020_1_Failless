'use strict';

import View from 'Eventum/core/view.js';
import {tags, events} from 'Eventum/utils/static-data.js';
import getPageUrl from 'Eventum/utils/get-img-url.js';

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
        this.isEvent = false;
        this.data = null;
    }

    /**
     * Render template
     * @param {Object} data
     * @param {Array} selectedTags
     * @param {boolean} isEvent
     */
    render(data, selectedTags, isEvent) {
        this.data = data;
        this.isEvent = isEvent;
        this.#setUpPhotos();


        const template = {
            tags: tags,
            data: this.data,
            isEvent: isEvent,
            users: null,  // TODO: take it by AJAX
            events: null, // TODO: take it by AJAX
        };
        console.log(this.data);

        this.parent.innerHTML += Handlebars.templates['feed'](template);
        // let columns = this.parent.getElementsByClassName('feed__column');
        // columns[1].innerHTML = Handlebars.templates['feed-center']({profile: profile});
        // columns[2].innerHTML = Handlebars.templates['feed-right']({events: events});
    }

    updateData(data, isEvent) {
        const rightTemplate = {
            users: null,  // TODO: take it by AJAX
            events: null, // TODO: take it by AJAX
            isEvent: isEvent,
        };
        this.data = data;
        this.isEvent = isEvent;
        let columns = this.parent.getElementsByClassName('feed__column');
        columns[1].innerHTML = '';
        columns[2].innerHTML = '';
        this.#setUpPhotos();

        if (isEvent) {
            columns[1].innerHTML = Handlebars.templates['feed-events-center'](this.data);
        } else {
            columns[1].innerHTML = Handlebars.templates['feed-center'](this.data);
        }
        columns[2].innerHTML = Handlebars.templates['feed-right'](rightTemplate);
    }

    #setUpPhotos = () => {
        if (!this.data) {
            return;
        }
        if (this.data.photos !== null) {
            if (this.isEvent) {
                this.data.photos.forEach((item) => getPageUrl(item, 'events'));
            } else {
                this.data.photos.forEach((item) => getPageUrl(item, 'users'));
            }
        } else {
            this.data.photos = [getPageUrl('default.png', 'events')];
        }
    }
}
