'use strict';

import Controller from 'Eventum/core/controller';
import BigEventSearchView from 'Eventum/views/big-event-search-view';
import EventModel from 'Eventum/models/event-model';

/**
 * @class SearchController
 */
export default class SearchController extends Controller {

    /**
     * Construct obj of BigEventSearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new BigEventSearchView(parent);
        this.pageDownloaded = 1;
    }

    /**
     * Create action and render random events
     */
    action() {
        super.action();
        EventModel.getFeedEvents({page: 1, limit: 10, query: ''}).then(
            (events) => {
                this.view.render(events);
                this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
            },
            (onerror) => {
                this.view.render();
                this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
                console.error(onerror);
            });
    }

    /**
     * Send request to backend for query results on click 'Enter'
     * @param {KeyboardEvent} event - key-press event
     */
    #completeRequest = (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            const msg = document.querySelector('.big-search__message');
            if (msg) {
                msg.remove();
            }
            console.log(event.target.value);

            this.removeErrorMessage(event);

            EventModel.getEvents({page: this.pageDownloaded, limit: 10, query: event.target.value}).then(
                (events) => {
                    if (!events) {
                        this.view.renderNotFound();
                    } else if (Object.prototype.hasOwnProperty.call(events, 'message')) {
                        this.view.addErrorMessage(document.querySelector('.big-search__icon'), [events.message]);
                    } else {
                        ++this.pageDownloaded;
                        console.log(events);
                        this.view.renderResults(events);
                    }
                },
                (onerror) => {
                    console.error(onerror);
                });
        }
    };
}
