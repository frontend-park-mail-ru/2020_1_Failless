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
                console.log(events);
                this.view.render(events);
                document.getElementById('searchInput')
                    .addEventListener('keydown', this.#completeRequest.bind(this));
            }).catch(onerror => {
                this.view.render();
                 document.getElementById('searchInput')
                     .addEventListener('keydown', this.#completeRequest.bind(this));

                console.error(onerror);
        });

        // todo: create request to backend for taking events list

    }

    /**
     * Wait press enter for sending request to backend for query results
     * @param {KeyboardEvent} event - key-press event
     */
    #completeRequest = (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            console.log(event.target.value);
            EventModel.getEvents({page: 1, limit: 10, query: event.target.value})
                .then(events => {
                    ++this.pageDownloaded;
                    console.log(events);
                    this.view.renderResults(events);
                }).catch(onerror => {
                console.error(onerror);
            });
        }
    };
}
