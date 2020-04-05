'use strict';

import Controller from 'Eventum/core/controller.js';
import BigEventSearchView from 'Eventum/views/big-event-search-view.js';
import EventModel from 'Eventum/models/event-model.js';

/**
 * @class SearchController
 */
export default class BigEventSearchController extends Controller {

    /**
     * Construct obj of BigEventSearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.searching = false;
        this.view = new BigEventSearchView(parent);
        this.pageDownloaded = 1;
    }

    /**
     * Create action
     */
    action() {
        super.action();
        EventModel.getFeedEvents({page: 1, limit: 10, query: ''})
            .then((events) => {
                this.view.render(events);
                this.addEventHandler(document.getElementById('searchInput'), 'keydown', this.#completeRequest);
            }).catch(onerror => {
                this.view.render();
                this.addEventHandler(document.getElementById('searchInput'), 'keydown', this.#completeRequest);
                console.error(onerror);
        });
    }

    /**
     * Wait press enter for sending request to backend for query results
     * @param {KeyboardEvent} event - key-press event
     */
    #completeRequest = (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            console.log(event.target.value);

            this.removeErrorMessage(event);

            EventModel.getEvents({page: 1, limit: 10, query: event.target.value})
                .then(events => {
                    if (Object.prototype.hasOwnProperty.call(events, 'message')) {
                        this.view.addErrorMessage(document.getElementsByClassName('big-search__icon')[0], [events.message]);
                    } else {
                        ++this.pageDownloaded;
                        console.log(events);
                        this.view.renderResults(events);
                    }
                }).catch(onerror => {
                console.error(onerror);
            });
        }
    };
}
