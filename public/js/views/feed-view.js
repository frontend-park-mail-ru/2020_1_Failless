'use strict';

import View from 'Eventum/core/view';
import feedTemplate from 'Components/feed/template.hbs';
import feedCenterUsersTemplate from 'Blocks/feed-center-users/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import FeedModel from 'Eventum/models/feed-model';
import settings from 'Settings/config';
import {icons} from 'Eventum/utils/static-data';
import SmallEvent from 'Blocks/event/small-event-comp';
import MidEvent from 'Blocks/event/mid-event-comp';

/**
 * @class create SearchView class
 */
export default class FeedView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
        // Basically call this.#emptyvDOM()
        this.#emptyvDOM();
        this.model = FeedModel.instance;
    }

    destructor() {
        this.data = null;
        this.#emptyvDOM();
    }

    /**
     * Clear all components of vDOM
     * TODO: Component.removeComponent
     */
    #emptyvDOM() {
        this.vDOM = {
            filtersColumn: {
                node: null,
                tags: [],
            },
            centerColumn: {
                node: null,
            },
            eventsColumn: {
                node: null,
                personalEvents: {
                    node: null,
                    body: {
                        node: null,
                        events: [],
                    },
                },
                subscriptions: {
                    node: null,
                    body: {
                        node: null,
                        events: [],
                    },
                }
            }
        };
    }

    /**
     * Render initial template
     */
    render() {
        this.parent.innerHTML += feedTemplate({
            tags: this.model.tags,
        });
        this.#setvDOM();
    }

    async updateUser() {
        this.#setvDOM();
        this.#clearColumns();

        let userToShow = this.model.currentUser;
        let personalEventsArea = this.personalEventsBodyDiv;
        let subscriptionsArea = this.subscriptionsBodyDiv;

        if (userToShow) {
            userToShow.photos = `${settings.aws}/users/${userToShow.photos[0]}`;

            this.centerColumnDiv.innerHTML = feedCenterUsersTemplate({...userToShow});
            if (userToShow.own_events && (userToShow.own_events.small_events || userToShow.own_events.mid_events)) {
                if (userToShow.own_events.small_events) {
                    userToShow.own_events.small_events.forEach(smallEvent => {
                        let smallEventComp = new SmallEvent(smallEvent, false);
                        this.vDOM.eventsColumn.personalEvents.body.events.push(smallEventComp);
                        smallEventComp.renderAsElement(personalEventsArea, 'beforeend');
                    });
                }
                if (userToShow.own_events.mid_events) {
                    userToShow.own_events.mid_events.forEach(midEvent => {
                        let midEventComp = new MidEvent(midEvent, false);
                        this.vDOM.eventsColumn.personalEvents.body.events.push(midEventComp);
                        midEventComp.renderAsElement(personalEventsArea, 'beforeend');
                    });
                }
            } else {
                this.#showEmptyPersonalEvents();
            }
            if (userToShow.subscriptions && (userToShow.subscriptions.mid_events /*|| userToShow.subscriptions.big_events*/)) {
                if (userToShow.subscriptions.mid_events) {
                    userToShow.subscriptions.mid_events.forEach(midEvent => {
                        let midEventComp = new MidEvent(midEvent, false);
                        this.vDOM.eventsColumn.subscriptions.body.events.push(midEventComp);
                        midEventComp.renderAsElement(subscriptionsArea, 'beforeend');
                    });
                }
            } else {
                this.#showEmptySubscriptions();
            }
        } else {
            this.#showEmpty();
        }
    }

    async #showEmpty() {
        await this.#toggleHeadersInEventsColumn();
        await this.showError(this.centerColumnDiv, 'Больше никого не нашлось<br>Упростите критерии поиска и попытайте удачу снова<br>Если и это не помогло - полистайте эвенты в поиске и<br>возвращайтесь в ленту попозже', 'sad', null);
    }

    /**
     * Provided tags are rendered in the order
     * of them appearing in this.model.tags
     * highlight some of them
     */
    updateTags() {
        this.vDOM.filtersColumn.tags.reduce((order, tagNode, index) => {
            if (this.model.tags[index].active_class) {
                tagNode.classList.add(this.model.tags[index].active_class);
                tagNode.style.order = (order++).toString();
            }
        }, 0);
    }

    /**
     * In case server returned error fetching data list - show error
     * @param error
     */
    showFeedError(error) {
        console.error(error);

        this.#clearColumns();

        this.showError(this.centerColumnDiv, error, icons.get('warning'), null);
    }

    #setvDOM() {
        while (!this.vDOM.filtersColumn.node) {
            this.vDOM.filtersColumn.node = document.querySelector('.feed__column.feed__filters');
            this.vDOM.filtersColumn.tags = Array.prototype.slice.call(this.vDOM.filtersColumn.node.querySelectorAll('.tag__container'));
        }
        while (!this.vDOM.centerColumn.node) {
            this.vDOM.centerColumn.node = document.querySelector('.feed__column.feed__column_main');
        }
        while (!this.vDOM.eventsColumn.node) {
            this.vDOM.eventsColumn.node = document.querySelector('.feed__column.feed__column_events');
        }
        while (!this.vDOM.eventsColumn.personalEvents.node) {
            this.vDOM.eventsColumn.personalEvents.node = this.eventsColumnDiv.querySelector('.feed__personal-events');
        }
        while (!this.vDOM.eventsColumn.personalEvents.body.node) {
            this.vDOM.eventsColumn.personalEvents.body.node = this.personalEventsDiv.querySelector('.feed__personal-events_body');
        }
        while (!this.vDOM.eventsColumn.subscriptions.node) {
            this.vDOM.eventsColumn.subscriptions.node = this.eventsColumnDiv.querySelector('.feed__subscriptions');
        }
        while (!this.vDOM.eventsColumn.subscriptions.body.node) {
            this.vDOM.eventsColumn.subscriptions.body.node = this.subscriptionsDiv.querySelector('.feed__subscriptions_body');
        }
    }

    #clearColumns() {
        makeEmpty(this.centerColumnDiv);
        this.#clearPersonalEvents();
        this.#clearSubscriptions();
    }

    #clearPersonalEvents() {
        this.vDOM.eventsColumn.personalEvents.body.events.forEach(eventComp => {
            eventComp.removeComponent();
        });
        this.vDOM.eventsColumn.personalEvents.body.events = [];
        makeEmpty(this.personalEventsBodyDiv);
    }

    #clearSubscriptions() {
        this.vDOM.eventsColumn.subscriptions.body.events.forEach(eventComp => {
            eventComp.removeComponent();
        });
        this.vDOM.eventsColumn.subscriptions.body.events = [];
        makeEmpty(this.subscriptionsBodyDiv);
    }


    async #toggleHeadersInEventsColumn() {
        if (!this.personalEventsDiv.classList.contains('hidden')) {
            this.personalEventsDiv.classList.add('hidden');
        }
        if (!this.subscriptionsDiv.classList.contains('hidden')) {
            this.subscriptionsDiv.classList.add('hidden');
        }
    }

    async #showHeadersInEventsColumn() {
        this.personalEventsDiv.classList.remove('hidden');
        this.subscriptionsDiv.classList.remove('hidden');
    }

    async #showEmptyPersonalEvents() {
        this.#clearPersonalEvents();
        this.showError(this.personalEventsBodyDiv, 'Никуда не зовёт', null, null);
    }

    async #showEmptySubscriptions() {
        this.#clearSubscriptions();
        this.showError(this.subscriptionsBodyDiv, 'Никуда не идёт', null, null);
    }

    /***********************************************
                 Additional get functions
     ***********************************************/

    get filtersDiv() {
        return this.vDOM.filtersColumn.node;
    }

    get centerColumnDiv() {
        return this.vDOM.centerColumn.node;
    }

    get eventsColumnDiv() {
        return this.vDOM.eventsColumn.node;
    }

    get personalEventsDiv() {
        return this.vDOM.eventsColumn.personalEvents.node;
    }

    get personalEventsBodyDiv() {
        return this.vDOM.eventsColumn.personalEvents.body.node;
    }

    get subscriptionsDiv() {
        return this.vDOM.eventsColumn.subscriptions.node;
    }

    get subscriptionsBodyDiv() {
        return this.vDOM.eventsColumn.subscriptions.body.node;
    }
}
