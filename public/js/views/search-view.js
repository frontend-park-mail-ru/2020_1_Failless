'use strict';

import View from 'Eventum/core/view';
import searchTemplate from 'Components/big-search/template.hbs';
import searchGridTemplate from 'Blocks/search-grid/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import {determineClass} from 'Blocks/event/event';
import {prettifyDateTime} from 'Blocks/chat-list-item/chat-list-item';

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

    destructor() {
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

    /**
     * Render template
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', searchTemplate());
        this.#setDOMElements();
    }

    #setDOMElements = () => {
        while (!this.resultsArea) {
            this.resultsArea = document.querySelector('.big-search__results');
        }
    };

    showSearchError = (error) => {
        console.error(error);
        this.showError(this.resultsAreaDiv, error, 'warning', null);
    };

    renderResults(events) {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        if (events) {
            events.forEach((event) => {
                determineClass(event.Event);
                event.Event.date = new Date(event.Event.date).toLocaleString();
            });
        }
        resultsArea.insertAdjacentHTML('afterbegin', searchGridTemplate({events}));
    }

    renderNotFound() {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        this.showError(resultsArea, 'Ничего не нашлось ', 'sad', null).then();
    }
}
