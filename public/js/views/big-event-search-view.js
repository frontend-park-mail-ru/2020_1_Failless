'use strict';

import View from 'Eventum/core/view.js';
import bigSearchTemplate from 'Components/big-search/template.hbs';
import bigEventTemplate from 'Blocks/big-event/template.hbs';

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
        const template = bigSearchTemplate(search);
        this.parent.insertAdjacentHTML('beforeend', template);
        this.resultsArea = document.getElementsByClassName('big-search__grid')[0];
    }

    #renderEmptySearch = () => {
        console.log(' I am alive');
        const template = bigSearchTemplate();
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
                template += bigEventTemplate(event);
            });
        }

        this.resultsArea.insertAdjacentHTML('beforeend', template);
    }
}
