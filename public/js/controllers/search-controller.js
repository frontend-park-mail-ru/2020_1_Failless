'use strict';

import Controller from 'Eventum/core/controller';
import BigEventSearchView from 'Eventum/views/big-event-search-view';
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
        this.view = new BigEventSearchView(parent);
        this.pageDownloaded = 1;
        this.uid = null;
    }

    /**
     * Create action and render random events
     */
    action() {
        super.action();
        UserModel.getProfile().then(
            (profile) => {
                this.uid = profile.uid;
                EventModel.getEvents({uid: profile.uid, page: 1, limit: 10}).then(
                    (events) => {
                        console.log(events);
                        this.view.render(events);
                        this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
                        this.addEventHandler(document.querySelector('.big-search__results'), 'click', this.#followEvent);
                    },
                    (onerror) => {
                        this.view.render();
                        this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
                        this.addEventHandler(document.querySelector('.big-search__results'), 'click', this.#followEvent);
                        console.error(onerror);
                    });
            },
            (error) => {
                console.error(error);
                EventModel.getEvents({page: 1, limit: 10}).then(
                    (events) => {
                        console.log(events);
                        this.view.render(events);
                        this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
                        this.addEventHandler(document.querySelector('.big-search__results'), 'click', this.#followEvent);
                    },
                    (onerror) => {
                        this.view.render();
                        this.addEventHandler(document.querySelector('#searchInput'), 'keydown', this.#completeRequest);
                        this.addEventHandler(document.querySelector('.big-search__results'), 'click', this.#followEvent);
                        console.error(onerror);
                    });
            }
        );
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
            EventModel.getEvents({uid: this.uid, page: this.pageDownloaded, limit: 10, query: event.target.value}).then(
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
                console.log(profile.uid,
                    event.target.getAttribute('data-eid'),
                    event.target.getAttribute('data-etype'));
                EventModel.followEvent(
                    profile.uid,
                    event.target.getAttribute('data-eid'),
                    event.target.getAttribute('data-etype'))
                    .then(
                        (response) => {
                            console.log(response);
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
