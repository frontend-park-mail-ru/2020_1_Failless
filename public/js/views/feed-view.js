'use strict';

import View from 'Eventum/core/view';
import feedTemplate from 'Components/feed/template.hbs';
import feedCenterUsersTemplate from 'Blocks/feed-center-users/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import FeedModel from 'Eventum/models/feed-model';
import settings from 'Settings/config';
import {icons, STATIC_TAGS} from 'Eventum/utils/static-data';
import SmallEvent from 'Blocks/event/small-event-comp';
import MidEvent from 'Blocks/event/mid-event-comp';
import TextConstants from 'Eventum/utils/language/text';
import Filters from 'Blocks/filters/filters-comp';

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
            filters: null,
            centerColumn: {
                node: null,
                footer: {
                    node: null,
                }
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
            like_icon: icons.get('thumb-up'),
            skip_icon: icons.get('stack-overflow'),
            PERSONAL_EVENTS_HEADER: TextConstants.FEED__PERSONAL_EVENTS_HEADER,
            SUBSCRIPTIONS_HEADER: TextConstants.FEED__SUBSCRIPTIONS_HEADER,
        });
        this.vDOM.filters = new Filters({
            tags: this.model.tags,
            TAGS_HEADER: TextConstants.FILTERS__TAGS_HEADER,
            KEYWORDS_HEADER: TextConstants.FILTERS__KEYWORDS_HEADER,
            KEYWORDS_PLACEHOLDER: TextConstants.FILTERS__KEYWORDS_PLACEHOLDER,
            GENDER: TextConstants.BASIC__GENDER,
            MEN: TextConstants.BASIC__MEN,
            WOMEN: TextConstants.BASIC__WOMEN,
            AGE: TextConstants.BASIC__AGE,
            FROM: TextConstants.BASIC__FROM,
            TO: TextConstants.BASIC__TO,
            LOCATION: TextConstants.BASIC__LOCATION,
            FIND: TextConstants.BASIC__FIND,
        });
        this.vDOM.filters.renderIn(this.parent.querySelector('.filters'));
        this.#setvDOM();
    }

    async updateUser() {
        this.#setvDOM();
        this.#clearColumns();

        let userToShow = this.model.currentUser;
        let personalEventsArea = this.personalEventsBodyDiv;
        let subscriptionsArea = this.subscriptionsBodyDiv;

        if (userToShow) {
            this.#showUI();
            userToShow.photos = `${settings.aws}/users/${userToShow.photos[0]}`;
            // TODO: move it to separate function
            if (userToShow.tags) {
                userToShow.tags = userToShow.tags.map((tag) => {
                    let newTag = {...STATIC_TAGS[tag - 1]};
                    newTag.activeClass = 'tag__container_active';
                    return newTag;});
            }

            this.centerColumnBodyDiv.innerHTML = feedCenterUsersTemplate({...userToShow});
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
                this.#hideSubscriptions();
            }
        } else {
            this.#showEmpty();
        }
    }

    async #showEmpty() {
        await this.#hideUI();
        await this.showError(this.centerColumnBodyDiv, TextConstants.FEED__EMPTY, 'sad', null);
    }

    /**
     * Provided tags are rendered in the order
     * of them appearing in this.model.tags
     * highlight some of them
     * TODO: fix it
     */
    async updateTags() {
        this.model.feedRequest.tags.forEach(tagID => {
            this.model.tagList[tagID - 1].activeClass = 'tag__container_active';
        });
        let modelTags = this.model.tagList;
        let tagNodes = this.vDOM.filters.tags;

        for (let iii = 0; iii < tagNodes.length; iii++) {
            if (modelTags[iii].activeClass) {
                tagNodes[iii].classList.add(modelTags[iii].activeClass);
                tagNodes[iii].style.order = '-1';
            }
        }
    }

    /**
     * In case server returned error fetching data list - show error
     * @param error
     */
    showFeedError(error) {
        this.#clearColumns();
        this.showError(this.centerColumnBodyDiv, TextConstants.BASIC__ERROR, icons.get('warning'), null);
    }

    #setvDOM() {
        while (!this.vDOM.filters.element) {
            this.vDOM.filters.element = document.querySelector('.filters');
        }
        while (!this.vDOM.centerColumn.node) {
            this.vDOM.centerColumn.node = document.querySelector('.feed__main-body');
        }
        while (!this.vDOM.centerColumn.footer.node) {
            this.vDOM.centerColumn.footer.node = document.querySelector('.feed__main-footer');
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
        makeEmpty(this.centerColumnBodyDiv);
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

    async #showEmptyPersonalEvents() {
        this.#clearPersonalEvents();
        this.showError(this.personalEventsBodyDiv, TextConstants.FEED__NO_EVENTS, null, null);
    }

    async #showEmptySubscriptions() {
        this.#clearSubscriptions();
        this.showError(this.subscriptionsBodyDiv, TextConstants.FEED__NO_SUBS, null, null);
    }

    async #hideUI() {
        this.centerColumnFooterDiv.classList.add('hidden');
        this.personalEventsDiv.classList.add('hidden');
        await this.#hideSubscriptions();
    }

    async #showUI() {
        if (this.centerColumnFooterDiv.classList.contains('hidden')) {
            this.centerColumnFooterDiv.classList.remove('hidden');
        }
        if (this.personalEventsDiv.classList.contains('hidden')) {
            this.personalEventsDiv.classList.remove('hidden');
        }
        await this.#showSubscriptions();
    }

    async #hideSubscriptions() {
        if (!this.subscriptionsDiv.classList.contains('hidden')) {
            this.subscriptionsDiv.classList.add('hidden');
        }
    }

    async #showSubscriptions() {
        if (this.subscriptionsDiv.classList.contains('hidden')) {
            this.subscriptionsDiv.classList.remove('hidden');
        }
    }

    /**
     *
     * @param eid {Number}
     * @return {T}
     */
    findEventComponent(eid) {
        let tempEvent = this.vDOM.eventsColumn.personalEvents.body.events.find((event) => {return event.data.eid === eid});
        if (tempEvent) {
            return tempEvent;
        } else {
            return this.vDOM.eventsColumn.subscriptions.body.events.find((event) => {return event.data.eid === eid});
        }
    }

    /***********************************************
                 Additional get functions
     ***********************************************/

    get filterComp() {
        return this.vDOM.filters;
    }

    get centerColumnBodyDiv() {
        return this.vDOM.centerColumn.node;
    }

    get centerColumnFooterDiv() {
        return this.vDOM.centerColumn.footer.node;
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
