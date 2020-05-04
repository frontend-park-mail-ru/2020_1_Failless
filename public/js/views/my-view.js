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

    destructor() {
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
        this.leftColumn = document.querySelector('.my__left-column-body');
        this.mainColumn = document.querySelector('.my__main-column');
        this.circleHeader = document.querySelector('.my__left-column-header');
    }

    /**
     * Check if elements are set and return div of leftColumn
     * @return {HTMLElement}
     */
    get leftColumnDiv() {
        this.setDOMElements();
        return this.leftColumn;
    }

    /**
     * Check if elements are set and return div of mainColumn
     * @return {HTMLElement}
     */
    get mainColumnDiv() {
        this.setDOMElements();
        return this.mainColumn;
    }

    /**
     * Check if elements are set and return div of leftHeader (circles)
     * @return {HTMLElement}
     */
    get leftHeaderDiv() {
        this.setDOMElements();
        return this.circleHeader;
    }
}