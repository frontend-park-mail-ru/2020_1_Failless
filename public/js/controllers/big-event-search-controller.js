'use strict';

import Controller from '../core/controller.js';
import BigEventSearchView from '../views/big-event-search-view.js';
import EventModel from '../models/event-model.js';

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
        EventModel.getEvents({page: 1, query: ''})
            .then(events => {
                console.log(events);
                this.view.render(events);
                document.getElementById('searchInput')
                    .addEventListener('keydown', this.#completeRequest.bind(this));
            }).catch(onerror => {
            console.error(onerror);
        });

        // todo: create request to backend for taking events list

    }

    /**
     *
     * @param {Event} event
     */
    #highlightTag = (event) => {
        event.preventDefault();

        let hideButton = this.querySelector('.x_btn');
        if (this.style.opacity === '0.5') {
            this.style.opacity = '1';
            hideButton.style.display = 'block';
        } else {
            this.style.opacity = '0.5';
            hideButton.style.display = 'none';
        }
    };

    /**
     *
     * @param {KeyboardEvent} event
     * @returns {boolean}
     */
    #completeRequest = (event) => {
        console.log(event.target);
        if (event.code === 'Enter') {
            event.preventDefault();
            console.log(event.target.value);
            EventModel.getEvents({page: 1, query: event.target.value})
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