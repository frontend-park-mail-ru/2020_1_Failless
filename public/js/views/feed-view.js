'use strict';

import View from 'Eventum/core/view.js';
import getPageUrl from 'Eventum/utils/get-img-url.js';
import feedTemplate from 'Components/feed/template.hbs';
import feedCenterUsersTemplate from 'Blocks/feed-center-users/template.hbs';
import feedRightTemplate from 'Blocks/feed-right/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic.js';

/**
 * @class create SearchView class
 */
export default class FeedView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     * @param {Array} tags
     */
    constructor(parent, tags) {
        super(parent);
        this.parent = parent;
        this.tags = [...tags];
        this.data = null;
        this.columns = [];
    }

    /**
     * Render initial template
     * @param {Array} selectedTags
     */
    render(selectedTags) {
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
        });
        this.#getColumns();
    }

    /**
     * Updates central and right column of page
     * @param data
     */
    updateCenter(data) {
        if (this.columns.length !== 3) {
            this.#getColumns();
        }

        if (data) {
            this.data = {...data};
            if (this.data.tags) {
                this.data.tags.forEach((tag) => {tag.active_class = 'tag__container_active'});
            }
        } else {
            this.data = data;
        }
        makeEmpty(this.columns[1]);

        this.#setUpPhotos(this.data);

        this.columns[1].innerHTML = feedCenterUsersTemplate({data: this.data});
    }

    updateRight(events) {
        makeEmpty(this.columns[2]);

        this.columns[2].innerHTML = feedRightTemplate({
            personalEvents: events.personalEvents??null,
            subscriptions:  events.subscriptions??null,
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
        while (this.columns.length !== 3) {
            this.columns = this.parent.getElementsByClassName('feed__column');
        }
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
     */
    #setUpPhotos = (data) => {
        if (!data) {
            return;
        }
        if (data.photos) {
            data.photos.forEach((item) => getPageUrl(item, 'users'));
        } else {
            data.photos = [getPageUrl('default.png', 'users')];
        }
    }
}
