'use strict';

import Controller from 'Eventum/core/controller';
import SearchView from 'Eventum/views/search-view';
import EventModel from 'Eventum/models/event-model';
import UserModel from 'Eventum/models/user-model';
import {changeActionText} from 'Blocks/big-event/big-event';

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
        this.view = new SearchView(parent);
        this.pageDownloaded = 1;
        this.uid = null;
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    /**
     * Create action and render random events
     */
    action() {
        super.action();
        this.view.render();
        UserModel.getProfile().then(
            // User authorized
            (profile) => {
                this.uid = profile.uid;
                EventModel.getEvents({uid: profile.uid, page: 1, limit: 10}).then(
                    (events) => {
                        this.view.renderResults(events);
                    },
                    (error) => {
                        this.view.showSearchError(error);
                        console.error(error);
                    });
            },
            // User is not authorized
            () => {
                EventModel.getEvents({page: 1, limit: 10}).then(
                    (events) => {
                        this.view.renderResults(events);
                    },
                    (error) => {
                        this.view.showSearchError(error);
                        console.error(error);
                    });
            }
        );
        this.initHandlers([
            {
                attr: 'sendRequestOnEnter',
                events: [
                    {type: 'keydown', handler: this.#completeRequest},
                ]
            },
            {
                attr: 'followEvent',
                events: [
                    {type: 'click', handler: this.#followEvent},
                ]
            },
            {
                attr: 'sendRequestOnClick',
                events: [
                    {type: 'click', handler: this.#completeRequest},
                ]
            },
        ]);
    }

    /**
     * Send request to backend for query results on click 'Enter'
     * @param {KeyboardEvent} event - key-press event
     */
    #completeRequest = (event) => {
        if (event.code === 'Enter' || event.type === 'click') {
            event.preventDefault();
            const msg = document.querySelector('.big-search__message');
            if (msg) {
                msg.remove();
            }
            this.removeErrorMessage(event);
            let payload = document.querySelector('#searchInput').value;
            EventModel.getEvents({uid: this.uid, page: this.pageDownloaded, limit: 10, query: payload}).then(
                (events) => {
                    if (!events) {
                        this.view.renderNotFound();
                    } else if (Object.prototype.hasOwnProperty.call(events, 'message')) {
                        this.view.addErrorMessage(document.querySelector('.big-search__icon'), [events.message]);
                    } else {
                        ++this.pageDownloaded;
                        this.view.renderResults(events);
                    }
                },
                (error) => {
                    this.view.showSearchError(error);
                    console.error(error);
                });
        }
    };

    #followEvent = (event) => {
        event.preventDefault();

        if (!event.target.hasAttribute('data-eid') || !event.target.classList.contains('font__color_black')) {
            return;
        }

        UserModel.getProfile().then(
            (profile) => {
                if (!profile) {
                    // TODO: Show registration modal window
                    return;
                }
                EventModel.followEvent(
                    profile.uid,
                    event.target.getAttribute('data-eid'),
                    event.target.previousElementSibling.classList.contains('re--event__circle_mid') ? 'mid-event' : 'big-event')
                    .then(
                        (response) => {
                            changeActionText(event.target, 'green', 'Вы идёте');
                        },
                        (error) => {
                            changeActionText(event.target, 'red', 'Ошибка');
                            console.log(error);
                        }
                    );
            },
            (error) => {
                console.log(error);
            }
        );
    };
}
