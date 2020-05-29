'use strict';

import Controller from 'Eventum/core/controller';
import SearchView from 'Eventum/views/search-view';
import EventModel from 'Eventum/models/event-model';
import UserModel from 'Eventum/models/user-model';
import TextConstants from 'Eventum/utils/language/text';
import {changeActionText} from 'Blocks/event/event';
import {detectMobile} from 'Eventum/utils/basic';
import {highlightTag} from 'Eventum/utils/tag-logic';

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
        this.pageDownloaded = 0;
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
        UserModel.getProfile().finally(
            (profile) => { // User authorized
                EventModel.getSearchEvents({uid: profile ? profile.uid : null, page: 0, limit: 30})
                    .then((events) => {
                        this.view.renderResults(events);
                    }).catch((error) => {
                        this.view.showSearchError(error);
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
            {
                attr: 'highlightTag',
                events: [
                    {type: 'click', handler: highlightTag},
                ]
            },
            {
                attr: 'toggleFiltersActive',
                events: [
                    {type: 'click', handler: () => document.querySelector('.filters').classList.toggle('filters_active')},
                ]
            },
            {
                attr: 'removeFiltersActive',
                many: true,
                events: [
                    {type: 'click', handler: () => {document.querySelector('.filters').classList.remove('filters_active');}},
                ]
            },
            {
                attr: 'applyFilters',
                events: [
                    {type: 'submit', handler: this.#applyFilters},
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
            let payload = this.view.queryInput.value;
            UserModel.getProfile()
                .then((profile) => {
                    return EventModel.getSearchEvents({
                        uid: profile.uid,
                        page: this.pageDownloaded,
                        limit: 30,
                        query: payload
                    });
                }).catch(() => {
                    return EventModel.getSearchEvents({
                        page: this.pageDownloaded,
                        limit: 30,
                        query: payload
                    });
                }).then((events) => {
                    if (!events || !events.mid_events) {
                        this.view.renderNotFound();
                    } else if (Object.prototype.hasOwnProperty.call(events, 'message')) {
                        this.view.addErrorMessage(document.querySelector('.big-search__icon'), [events.message]);
                    } else {
                        // ++this.pageDownloaded;
                        this.view.renderResults(events);
                    }
                });
        }
    };

    #followEvent = (event) => {
        event.preventDefault();

        if (!event.target.hasAttribute('data-eid') || !event.target.classList.contains('font__color_black')) {
            return;
        }

        const eid = event.target.getAttribute('data-eid');
        let eventComponent = this.view.vDOM.results.grid.events.find((event) => {
            return event.data.eid === Number(eid);
        });

        UserModel.getProfile().then(
            (profile) => {
                if (!profile) {
                    // TODO: Show registration modal window
                    return;
                }
                if (event.target.previousElementSibling.classList.contains('event__circle_mid')) {
                    EventModel.joinMidEvent(profile.uid, eid)
                        .then((response) => {
                            changeActionText(event.target, 'green', TextConstants.EVENT__YOU_GO);
                            eventComponent.incrementMembers();
                        },
                        (error) => {
                            changeActionText(event.target, 'red', TextConstants.BASIC__ERROR);
                        });
                } else if (event.target.previousElementSibling.classList.contains('event__circle_big')) {
                    EventModel.visitBigEvent(profile.uid, event.target.getAttribute('data-eid'))
                        .then((response) => changeActionText(event.target, 'green', TextConstants.EVENT__YOU_GO),
                            (error) => {
                                changeActionText(event.target, 'red', TextConstants.BASIC__ERROR);
                            });
                }
            }
        );
    };

    /**
     *
     * @param event
     * @return {{keyWords: [],
     *           maxAge: number,
     *           men: boolean,
     *           minAge: number,
     *           limit: number,
     *           tags: [],
     *           women: boolean}}
     */
    #applyFilters = (event) => {
        event.preventDefault();

        let request = Object.assign({
            uid: null,
            page: this.pageDownloaded,
            limit: 30,
            query: this.view.queryInput.value, // TODO: NOT SAFE
        }, this.view.vDOM.filters.getFilters());

        if (detectMobile()) {
            this.view.vDOM.filters.element.classList.remove('filters_active');
        }

        UserModel.getProfile()
            .then(user => request.uid = user.uid)
            .then(() => EventModel.getSearchEvents(request))
            .then(events => this.view.renderResults(events))
            .catch(error => this.view.showFeedError(error));
    };
}
