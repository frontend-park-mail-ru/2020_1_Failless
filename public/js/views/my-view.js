'use strict';

import View from 'Eventum/core/view.js';
import myTemplate from 'Components/my/template.hbs';

/**
 * @class create MyView class
 */
export default class MyView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
        this.leftColumn = null;
        this.mainArea = null;
    }

    /**
     * Render template
     */
    render() {
        console.log(document.referrer);
        // TODO: check previous url
        //  and if it contains '/my/' - don't render this
        this.parent.insertAdjacentHTML('beforeend', myTemplate());
        this.getDOMElements();
    }

    getDOMElements() {
        while (this.leftColumn === null) {
            this.leftColumn = document.querySelector('.my__left-column');
        }
        while (this.mainArea === null) {
            this.mainArea = document.querySelector('.my__main-column');
        }
    }
}