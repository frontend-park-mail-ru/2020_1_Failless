'use strict';

import View from 'Eventum/core/view';
import searchTemplate from 'Components/big-search/template.hbs';
import searchGridTemplate from 'Blocks/search-grid/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';

/**
 * @class create SearchView class
 */
export default class SearchView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
        this.resultsArea = null;
    }

    /**
     * Check if elements are set and return div of results area
     * @return {Element}
     */
    get resultsAreaDiv() {
        this.#setDOMElements();
        return this.resultsArea;
    }

    set cleanAreaDiv(val) {
        this.resultsArea = val;
    }

    /**
     * Render template
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', searchTemplate());
        this.resultsArea = null;
        this.#setDOMElements();
    }

    #setDOMElements = () => {
        while (!this.resultsArea) {
            this.resultsArea = document.querySelector('.big-search__results');
        }
    };

    showSearchError = (message) => {
        this.showError(this.resultsAreaDiv, message, 'warning', null);
    };

    renderResults(events) {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        if (events) {
            events.forEach((event) => {
                event.class = (Object.prototype.hasOwnProperty.call(event.Event, 'author')) ? 'mid-event' : 'big-event';
            });
        }
        resultsArea.insertAdjacentHTML('afterbegin', searchGridTemplate({events: events}));
    }

    renderNotFound() {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        this.showError(resultsArea, 'Ничего не нашлось ', 'sad', null).then();
    }
}
