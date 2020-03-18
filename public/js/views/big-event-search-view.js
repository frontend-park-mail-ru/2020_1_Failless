'use strict';

import View from '../core/view.js';

/**
 * @class create SearchView class
 */
export default class BigEventSearchView extends View {

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
     * Render template
     * @param {JSON} events
     */
    render(events) {
        const search = {
            events: events,
        };
        const template = Handlebars.templates['big-search'](search);
        this.parent.insertAdjacentHTML('beforeend', template);
        this.resultsArea = document.getElementsByClassName('big-search__grid')[0];
    }

    #renderEmptySearch = () => {
        console.log(' I am alive');
        const template = Handlebars.templates['big-search']();
        this.parent.insertAdjacentHTML('beforeend', template);
    };

    renderResults(results) {
        if (this.resultsArea) {
            this.resultsArea.innerHTML = '';
        }
        this.appendResults(results);
    }

    appendResults(events) {
        let template = '';
        if (events) {
            events.forEach(event => {
                template += Handlebars.templates['big-event'](event);
            });
        }

        this.resultsArea.insertAdjacentHTML('beforeend', template);
    }
}
