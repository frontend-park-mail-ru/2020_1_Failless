'use strict';

import View from 'Eventum/core/view';
import searchTemplate from 'Components/big-search/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import MidEventComponent from 'Blocks/event/mid-event-comp';
// import BigEventComponent from 'Blocks/event/big-event-comp';

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

        this.vDOM = {
            header: {
                comp: null,
                element: null,
            },
            results: {
                comp: null,
                element: null,
                error: null,
                grid: {
                    element: null,
                    events: [],
                }
            }
        };
    }

    destructor() {
        this.vDOM.results.element = null;
    }

    /**
     * Render template
     */
    render() {
        this.parent.insertAdjacentHTML('beforeend', searchTemplate());
        this.#setDOMElements();
    }

    showSearchError = (error) => {
        console.error(error);
        this.showError(this.resultsAreaDiv, error, 'warning', null);
    };

    renderResults(events) {
        const resultsArea = this.resultsAreaDiv;
        if (resultsArea.firstElementChild.classList.contains('error') || resultsArea.firstElementChild.classList.contains('spinner')) {
            makeEmpty(resultsArea);
            let grid = document.createElement('div');
            grid.classList.add('big-search__grid');
            this.vDOM.results.grid.element = resultsArea.insertAdjacentElement('afterbegin', grid);
            console.log(this.vDOM.results);
        }
        if (events && events.mid_events.length > 0) {
            events.mid_events.forEach((midEvent) => {
                // Create components
                let midEventComponent = new MidEventComponent(midEvent, false);
                this.vDOM.results.grid.events.push(midEventComponent);
                midEventComponent.renderAsElement(this.vDOM.results.grid.element, 'beforeend');
            });
        }
    }

    renderNotFound() {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        this.showError(resultsArea, 'Ничего не нашлось ', 'sad', null).then();
    }

    #setDOMElements = () => {
        while (!this.vDOM.results.element) {
            this.vDOM.results.element = document.querySelector('.big-search__results');
        }
        while (!this.vDOM.header.element) {
            this.vDOM.header.element = document.querySelector('.big-search__header');
        }
    };

    /***********************************************
                 Additional get functions
     ***********************************************/

    /**
     * @return {Element}
     */
    get headerDiv() {
        this.#setDOMElements();
        return this.vDOM.header.element;
    }

    /**
     * @return {Element}
     */
    get resultsAreaDiv() {
        this.#setDOMElements();
        return this.vDOM.results.element;
    }
}
