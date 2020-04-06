'use strict';

import View from 'Eventum/core/view.js';
import {events} from 'Eventum/utils/static-data.js';
import getPageUrl from 'Eventum/utils/get-img-url.js';
import feedTemplate from 'Components/feed/template.hbs';
import feedCenterTemplate from 'Blocks/feed-center/template.hbs';
import feedEventsCenterTemplate from 'Blocks/feed-events-center/template.hbs';
import feedRightTemplate from 'Blocks/feed-right/template.hbs';

/**
 * @class create SearchView class
 */
export default class FeedUsersView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     * @param {Array} tags
     */
    constructor(parent, tags) {
        super(parent);
        this.parent = parent;
        this.tags = tags;
        this.isEvent = false;
        this.data = null;
    }

    /**
     * Render template
     * @param {Object} data
     * @param {Array} selectedTags
     * @param {boolean} isEvent
     * @param {Array }followers
     */
    render(data, selectedTags, isEvent, followers = null) {
        this.data = data;
        this.isEvent = isEvent;
        this.#setUpPhotos(data, isEvent);
        if (followers !== null) {
            followers.forEach((user) => {
                this.#setUpPhotos(user, !isEvent);
            });
        }
        this.tags.forEach((tag) => {
             tag.editable = true;
            if (selectedTags.includes(tag.name)) {
                tag.active_class = 'tag__container__active';
            }
        });

        const template = {
            tags: this.tags,
            data: this.data,
            isEvent: isEvent,
            users: followers,
            events: null, // TODO: take it by AJAX
        };
        console.log(this.data);

        this.parent.innerHTML += feedTemplate(template);
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
        this.#setUpPhotos(data, isEvent);

        if (isEvent) {
            columns[1].innerHTML = feedEventsCenterTemplate(this.data);
        } else {
            columns[1].innerHTML = feedCenterTemplate(this.data);
        }
        columns[2].innerHTML = feedRightTemplate(rightTemplate);
    }

    #setUpPhotos = (data, isEvent) => {
        if (!data) {
            return;
        }
        if (data.photos !== null) {
            if (isEvent) {
                data.photos.forEach((item) => getPageUrl(item, 'events'));
            } else {
                data.photos.forEach((item) => getPageUrl(item, 'users'));
            }
        } else {
            if (isEvent) {
                data.photos = [getPageUrl('default.png', 'events')];
            } else {
                data.photos = [getPageUrl('default.png', 'users')];
            }
        }
    }
}
