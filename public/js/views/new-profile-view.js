'use strict';

import MyView from './my-view.js';

/**
 * @class create NewProfileView class
 */
export default class NewProfileView extends MyView {

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
        super.render();
        document.getElementsByClassName('my__left_column__body')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-left']());
        document.getElementsByClassName('my__main_column')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-main']({
                title: 'Профиль',
                photos: ['/ProfilePhotos/1.jpg', '/ProfilePhotos/2.jpg', '/ProfilePhotos/3.jpg',
                    '/ProfilePhotos/1.jpg', '/ProfilePhotos/2.jpg', '/ProfilePhotos/3.jpg'],
                events: {
                    personal: [],
                    others: [],
                },
            }));
    }
}