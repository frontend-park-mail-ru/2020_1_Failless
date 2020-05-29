'use strict';

import View from 'Eventum/core/view';
import searchTemplate from 'Components/big-search/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import MidEventComponent from 'Blocks/event/mid-event-comp';
import Filters from 'Blocks/filters/filters-comp';
import TextConstants from 'Eventum/utils/language/text';
import {STATIC_TAGS} from 'Eventum/utils/static-data';

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
            filters: null,
            header: {
                comp: null,
                element: null,
                offers: null,
                input: null,
            },
            attention: null,
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
        this.parent.insertAdjacentHTML('beforeend', searchTemplate({
            LOADING: TextConstants.BASIC__LOADING,
            PLACEHOLDER: TextConstants.SEARCH__PLACEHOLDER,
            FIND: TextConstants.BASIC__SEARCH,
        }));
        this.vDOM.filters = new Filters({
            tags: [...STATIC_TAGS],
            user_limit: true,
        });
        this.vDOM.filters.renderIn(this.parent.querySelector('.filters'));
        this.#setvDOM();
    }

    showSearchError = () => {
        this.showError(this.resultsAreaDiv, TextConstants.BASIC__ERROR, 'warning', null);
    };

    renderResults(data) {
        const resultsArea = this.resultsAreaDiv;
        if (resultsArea.firstElementChild.classList.contains('error') || resultsArea.firstElementChild.classList.contains('spinner')) {
            makeEmpty(resultsArea);
            let grid = document.createElement('div');
            grid.classList.add('big-search__grid');
            this.vDOM.results.grid.element = resultsArea.insertAdjacentElement('afterbegin', grid);
        }
        if (data && data.mid_events !== null) {
            data.mid_events.forEach((event) => {
                event.date = new Date(event.date).toLocaleString();
                let midEventComponent = new MidEventComponent(event, false);
                this.vDOM.results.grid.events.push(midEventComponent);
                midEventComponent.renderAsElement(this.vDOM.results.grid.element, 'beforeend');
            });
            // events.mid_events.forEach((midEvent) => {
            //     // Create components
            //     let midEventComponent = new MidEventComponent(midEvent, false);
            //     this.vDOM.results.grid.events.push(midEventComponent);
            //     midEventComponent.renderAsElement(this.vDOM.results.grid.element, 'beforeend');
            // });
        } else {
            this.renderNotFound();
        }
    }

    renderNotFound() {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        this.showError(resultsArea, TextConstants.SEARCH__NO_RESULTS, 'sad', null).then();
    }

    #setvDOM = () => {
        while (!this.vDOM.results.element) {
            this.vDOM.results.element = document.querySelector('.big-search__results');
        }
        while (!this.vDOM.header.element) {
            this.vDOM.header.element = document.querySelector('.big-search__search');
        }
        if (!this.vDOM.header.input) {
            this.vDOM.header.input = this.vDOM.header.element.querySelector('#searchInput');
        }
    };

    /***********************************************
     Additional get functions
     ***********************************************/

    /**
     * @return {Element}
     */
    get headerDiv() {
        return this.vDOM.header.element;
    }

    get queryInput() {
        return this.vDOM.header.input;
    }

    /**
     * @return {Element}
     */
    get resultsAreaDiv() {
        this.#setvDOM();
        return this.vDOM.results.element;
    }

    get filtersComp() {
        return this.vDOM.filters;
    }
}
