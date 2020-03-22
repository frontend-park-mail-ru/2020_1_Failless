'use strict';

import PrivateView from './private-view.js';

/**
 * @class create NewProfileView class
 */
export default class NewProfileView extends PrivateView {

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
        console.log('new profile view renders');
        document.getElementsByClassName('private__left_column__body')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-left']());
        document.getElementsByClassName('private__main_column')[0].insertAdjacentHTML(
            'beforeend', Handlebars.templates['new-profile-main']());
    }
}