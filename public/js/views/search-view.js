'use strict';

import View from 'Eventum/core/view';
import searchTemplate from 'Components/big-search/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import MidEventComponent from 'Blocks/event/mid-event-comp';
import Filters from 'Blocks/filters/filters-comp';
import TextConstants from 'Eventum/utils/language/text';
import FeedModel from 'Eventum/models/feed-model';
import FiltersTemplate from 'Blocks/filters/template.hbs';

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
        this.parent.insertAdjacentHTML('beforeend', searchTemplate({LOADING: TextConstants.BASIC__LOADING}));
        this.#setDOMElements();
    }

    showSearchError = (error) => {
        console.error(error);
        this.showError(this.resultsAreaDiv, error, 'warning', null);
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
        }
        // makeEmpty(resultsArea);
        // if (data && data.mid_events !== null) {
        //     console.log('events is');
        //     console.log(data);
        //     data.mid_events.forEach((event) => {
        //         determineClass(event);
        //         event.date = new Date(event.date).toLocaleString();
        //     });
        // }
        // const events = data.mid_events;
        // resultsArea.insertAdjacentHTML('afterbegin', searchGridTemplate({events}));
    }

    renderNotFound() {
        const resultsArea = this.resultsAreaDiv;
        makeEmpty(resultsArea);
        this.showError(resultsArea, TextConstants.SEARCH__NO_RESULTS, 'sad', null).then();
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

    renderQueryPanel() {
        this.vDOM.header.input = document.querySelector('#searchInput');
        this.vDOM.attention = {
            element: null,
            filters: null,
        };
        this.vDOM.attention.element = document.createElement('div');
        this.vDOM.attention.element.className = 'big-search__attention';
        this.vDOM.attention.filters = new Filters({
            tags: FeedModel.tags,
            TAGS_HEADER: TextConstants.FILTERS__TAGS_HEADER,
            KEYWORDS_HEADER: TextConstants.FILTERS__KEYWORDS_HEADER,
            KEYWORDS_PLACEHOLDER: TextConstants.FILTERS__KEYWORDS_PLACEHOLDER,
            GENDER: TextConstants.BASIC__GENDER,
            MEN: TextConstants.BASIC__MEN,
            WOMEN: TextConstants.BASIC__WOMEN,
            AGE: TextConstants.BASIC__AGE,
            FROM: TextConstants.BASIC__FROM,
            TO: TextConstants.BASIC__TO,
            LOCATION: TextConstants.BASIC__LOCATION,
            FIND: TextConstants.BASIC__FIND,
        });
        this.vDOM.header.element.insertAdjacentElement('afterend', this.vDOM.attention.element);
        this.vDOM.attention.element.insertAdjacentHTML('beforeend', FiltersTemplate(this.vDOM.attention.filters));
        return this.vDOM.attention.element;
    }

    destroyQueryPanel() {
        this.vDOM.attention.element.parentNode.removeChild(this.vDOM.attention.element);
        this.vDOM.attention = null;
        return this.vDOM.header.input;
    }
}
