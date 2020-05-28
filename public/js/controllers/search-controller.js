'use strict';

import Controller from 'Eventum/core/controller';
import SearchView from 'Eventum/views/search-view';
import EventModel from 'Eventum/models/event-model';
import UserModel from 'Eventum/models/user-model';
import {changeActionText} from 'Blocks/event/event';
import TextConstants from 'Eventum/utils/language/text';

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
                EventModel.getSearchEvents({uid: profile ? profile.uid : null, page: 1, limit: 10})
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
                many: true,
                events: [
                    {type: 'keydown', handler: this.#completeRequest},
                    {type: 'click', handler: this.#inputQuery},
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
            if (this.view.vDOM.attention) {
                this.#removeQueryInput();
            }
            event.preventDefault();
            const msg = document.querySelector('.big-search__message');
            if (msg) {
                msg.remove();
            }
            this.removeErrorMessage(event);
            let payload = document.querySelector('#searchInput').value; // TODO: fix this.uid
            UserModel.getProfile()
                .then((profile) => {
                    return EventModel.getSearchEvents({
                        uid: profile.uid,
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
                        ++this.pageDownloaded;
                        this.view.renderResults(events);
                    }
                },
                (error) => {
                    this.view.showSearchError(error);
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

    #inputQuery = (event) => {
        const attention = this.view.renderQueryPanel();
        event.target.removeEventListener('click', this.#inputQuery);
        attention.addEventListener('click', this.#removeAfterClick);
        document.addEventListener('keydown', this.#removeAfterEscape);
    };

    #removeQueryInput = (event = null) => {
        const input = this.view.destroyQueryPanel();
        input.addEventListener('click', this.#inputQuery);
        if (event) {
            event.currentTarget.removeEventListener('click', this.#removeAfterClick);
            document.removeEventListener('keydown', this.#removeAfterEscape);
        }
    };

    #removeAfterEscape = (event) => {
        if (event.key === 'Escape') {
            this.#removeQueryInput(event);
        } else if (event.key === 'Enter') {
            this.#removeQueryInput(event);
            this.#completeRequest(event);
        }
    };

    #removeAfterClick = (event) => {
        if (event.target.className === 'big-search__attention') {
            this.#removeQueryInput(event);
        }
    };
}
