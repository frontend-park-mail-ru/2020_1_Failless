'use strict';

import View from 'Eventum/core/view.js';
import getPageUrl from 'Eventum/utils/get-img-url.js';
import feedTemplate from 'Components/feed/template.hbs';
import feedCenterUsersTemplate from 'Blocks/feed-center-users/template.hbs';
import feedEventsCenterTemplate from 'Blocks/feed-events-center/template.hbs';
import feedRightTemplate from 'Blocks/feed-right/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic.js';

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
        this.tags = [...tags];
        this.isEvent = false;
        this.data = null;
        this.columns = [];
    }

    /**
     * Render initial template
     * @param {Array} selectedTags
     */
    render(selectedTags, isEvent) {
        // Mark some tags as selected
        if (selectedTags) {
            this.tags.forEach((tag) => {
                tag.editable = true;
                if (selectedTags.includes(tag.name)) {
                    tag.active_class = 'tag__container__active';
                }
            });
        }

        this.parent.innerHTML += feedTemplate({
            tags: this.tags,
            isEvent: isEvent,
        });
        this.#getColumns();
    }

    /**
     * Updates central and right column of page
     * @param data
     * @param {boolean} isEvent
     */
    updateCenter(data, isEvent) {
        if (!this.columns) {
            this.#getColumns();
        }

        if (data) {
            this.data = {...data};
            this.data.tag.activeClass = 'tag__container_active';
        } else {
            this.data = data;
        }
        this.isEvent = isEvent;

        makeEmpty(this.columns[1]);

        this.#setUpPhotos(this.data, isEvent);

        this.columns[1].innerHTML = isEvent
            ? feedEventsCenterTemplate({data: this.data})
            : feedCenterUsersTemplate({data: this.data});
    }

    updateRight(followers, isEvent) {
        makeEmpty(this.columns[2]);

        this.columns[2].innerHTML = feedRightTemplate({
            users:      isEvent ? null : followers,
            events:     isEvent ? followers : null,
            isEvent:    isEvent,
        });
    }

    /**
     * In case server returned error fetching data list - show error
     * @param error
     */
    showError(error) {
        this.#clearColumns();

        this.columns[1].innerHTML = `<span class="font font_bold font__size_middle font__color_lg error-message">${error}</span`;
        this.columns[2].innerHTML = '<span>Server error<br><br>Keep calm<br>Keep refreshing<br></span>';
    }

    showErrorRight(error) {
        makeEmpty(this.columns[2]);

        this.columns[2].innerHTML = `<span class="font font_bold font__size_middle font__color_lg error-message">${error}</span`;
    }

    showLoadingCenter() {
        makeEmpty(this.columns[1]);

        this.columns[1].innerHTML = '<div class="spinner"></div>';
    }

    showLoadingRight() {
        makeEmpty(this.columns[2]);

        this.columns[2].innerHTML = '<div class="spinner"></div>';
    }

    /**
     * Simply retrieve columns from document
     */
    #getColumns() {
        this.columns = this.parent.querySelectorAll('.feed__column');
    }

    #clearColumns() {
        if (!this.columns) {
            this.#getColumns();
        }
        makeEmpty(this.columns[1]);
        makeEmpty(this.columns[2]);
    }

    /**
     * TODO: what the fuck does this do
     * @param data
     * @param isEvent
     */
    #setUpPhotos = (data, isEvent) => {
        if (!data) {
            return;
        }
        if (data.photos) {
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
