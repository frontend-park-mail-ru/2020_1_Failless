'use strict';

import EventModel from 'Eventum/models/event-model';
import UserModel from 'Eventum/models/user-model';
import Controller from 'Eventum/core/controller';
import FeedView from 'Eventum/views/feed-view';
import settings from 'Settings/config';
import {highlightTag} from 'Eventum/utils/tag-logic';
import {profileCheck} from 'Eventum/utils/user-utils';
import {showMessageWithRedirect} from 'Eventum/utils/render';
import FeedModel from 'Eventum/models/feed-model';
import {toggleActionText} from 'Blocks/event/event';
import Router from 'Eventum/core/router';
import TextConstants from 'Eventum/utils/language/text';

/**
 * @class FeedController
 */
export default class FeedController extends Controller {

    /**
     * Construct obj of FeedController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new FeedView(parent);
        this.model = FeedModel.instance;
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    /**
     * Action when page renders for the first time
     */
    action() {
        super.action();
        this.view.render();
        UserModel.getProfile().then((user) => {
            this.model.userMessages = profileCheck(user);
            this.model.feedRequest.uid = user.uid;
            if (user.tags) {
                this.model.feedRequest.tags = [...user.tags];
            }
            this.view.updateTags();

            // Fetch content to show
            this.#initDataList()
                .then(data => this.view.updateUser())
                .catch(error => this.view.showFeedError(error));
            this.initHandlers([
                {
                    attr: 'highlightTag',
                    events: [
                        {type: 'click', handler: highlightTag},
                    ]
                },
                {
                    attr: 'applyFilters',
                    events: [
                        {type: 'submit', handler: this.#applyFilters},
                    ]
                },
                {
                    attr: 'toggleFiltersActive',
                    events: [
                        {type: 'click', handler: () => {document.querySelector('.filters').classList.toggle('filters_active');}},
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
                    attr: 'handleVote',
                    events: [
                        {type: 'click', handler: this.#voteHandler},
                    ]
                },
                {
                    attr: 'showAction',
                    events: [
                        {type: 'mouseover', handler: (event) => {
                            if (event.target.matches('.event__link.font__color_green')) {
                                toggleActionText(event.target, TextConstants.EVENT__LEAVE);
                            }}},
                        {type: 'click', handler: (event) => {
                            if (event.target.matches('.event__link.font__color_red')) {
                                this.#unfollowEvent(event.target);
                            } else if (event.target.matches('.event__link.font__color_black')) {
                                this.#followEvent(event.target);
                            } else if (event.target.matches('button.error__button')) {
                                Router.redirectForward('/search');
                            }}},
                        {type: 'mouseout', handler: (event) => {
                            if (event.target.matches('.event__link.font__color_red')) {
                                toggleActionText(event.target, TextConstants.EVENT__VISITED);
                            }}},
                    ]
                },
            ]);
        });
    }

    #followEvent = (linkElement) => {
        UserModel.getProfile().then(
            (profile) => {
                let eid = linkElement.getAttribute('data-eid');
                let eventComponent = this.view.findEventComponent(Number(eid));

                if (!eventComponent) {
                    return;
                }

                if (eventComponent.type === 'mid') {
                    return EventModel.joinMidEvent(profile.uid, eid)
                        .then((response) => eventComponent.state = true);
                }
            }
        );
    };

    #unfollowEvent = (linkElement) => {
        UserModel.getProfile().then(
            (profile) => {
                let eid = linkElement.getAttribute('data-eid');
                let eventComponent = this.view.findEventComponent(Number(eid));

                if (!eventComponent) {
                    return;
                }

                if (eventComponent.type === 'mid') {
                    EventModel.leaveMidEvent(profile.uid, eid)
                        .then((response) => eventComponent.state = false);
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

        if (this.model.userMessages.length !== 0) {
            showMessageWithRedirect(this.model.userMessages, 'Profile');
            return;
        }

        let filters = this.view.filterComp.getFilters();

        let request = {
            uid: null,
            page: this.model.currentPageNumber,
            limit: 10,
            query: filters.keyWords ? String(...filters.keyWords) : null,
            tags: filters.tags,
            Location: null,
            minAge: filters.minAge,
            maxAge: filters.maxAge,
            men: filters.men,
            women: filters.women,
        };

        UserModel.getProfile()
            .then(user => request.uid = user.uid)
            .then(() => this.#initDataList(request))
            .then(() => this.view.updateUser())
            .catch(error => this.view.showFeedError(error));
    };

    /**
     * Handle click on like buttons
     * @param event
     */
    #voteHandler = (event) => {
        if (event.target.matches('div')) {
            return;
        }

        if (this.model.userMessages.length !== 0) {
            showMessageWithRedirect(this.model.userMessages, 'Profile');
            return;
        }

        if (event.target.closest('button').matches('.feed__button.feed__button-skip')) {
            showMessageWithRedirect(TextConstants.FEED__PAY_TO_SKIP, 'Profile');
            return;
        }

        const isLike = event.target.closest('button').matches('.feed__button.feed__button-approve');
        // Get id-s
        const vote = {
            uid: undefined,
            id: this.model.currentUser.uid,
            value: isLike ? 1 : -1,
        };

        UserModel.getProfile()
            .then(user => vote.uid = user.uid)
            .then(() => EventModel.userVote(vote))
            .catch((error) => this.view.showFeedError(error));

        // Show next item
        ++this.model.currentUserNumber;
        if (this.model.currentUserNumber < settings.pageLimit) {
            this.view.updateUser();
        } else {
            // Go get next items
            this.model.currentUserNumber = 0;
            ++this.model.currentPageNumber;
            this.model.userList.length = 0;
            this.model.feedRequest.page = this.model.currentPageNumber;
            this.#initDataList()
                .then(data => this.view.updateUser())
                .catch(error => this.view.showFeedError(error));
        }
    };

    /**
     * Get users list to show in feed
     * @return {Promise<T>}
     */
    #initDataList = (request = this.model.feedRequest) => {
        return EventModel.getFeedUsers(request).then(
            (users) => {
                if (users) {
                    this.model.userList = users;
                }
            },
            (error) => {
                throw new Error(error);
            });
    };
}
