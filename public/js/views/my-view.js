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
        this.circleHeader = null;
        this.leftColumn = null;
        this.mainColumn = null;
    }

    /**
     * Render template
     */
    render() {
        console.log(document.referrer);
        // TODO: check previous url
        //  and if it contains '/my/' - don't render this
        this.parent.insertAdjacentHTML('beforeend', myTemplate());
        this.setDOMElements();
    }

    setDOMElements() {
        while (this.leftColumn === null) {
            this.leftColumn = document.querySelector('.my__left-column-body');
        }
        while (this.mainColumn === null) {
            this.mainColumn = document.querySelector('.my__main-column');
        }
        while (!this.circleHeader) {
            this.circleHeader = document.querySelector('.my__left-column-header');
        }
    }

    get leftColumnDiv() {
        this.setDOMElements();
        return this.leftColumn;
    }

    get mainColumnDiv() {
        this.setDOMElements();
        return this.mainColumn;
    }

    get leftHeaderDiv() {
        this.setDOMElements();
        return this.circleHeader;
    }
}