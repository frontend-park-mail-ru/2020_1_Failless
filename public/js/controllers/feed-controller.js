'use strict';

import EventModel from 'Eventum/models/event-model';
import UserModel from 'Eventum/models/user-model';
import Controller from 'Eventum/core/controller';
import FeedView from 'Eventum/views/feed-view';
import settings from 'Settings/config';
import {MAX_AGE, MIN_AGE} from 'Eventum/utils/static-data';
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
        this.defaultFeedRequest = {
            uid: null,
            page: 1,
            limit: settings.pageLimit,
            query: '',
            tags: [],
            location: null,
            minAge: MIN_AGE,
            maxAge: MAX_AGE,
            men: true,
            women: true,
        };
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
                this.model.feedRequest.tags = user.tags.map(tag => tag.tag_id);
                this.#initTags(user.tags);
            }

            // Fetch content to show
            this.#initDataList(this.model.feedRequest)
                .then(data => this.#updateView(),)
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
                {   // TODO: do this
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

    /**
     * Set tags active equal to user's own tags
     * @param userTags
     * @return {Promise<void>}
     */
    async #initTags(userTags) {
        userTags.forEach(userTag => {
            this.model.tags[userTag.tag_id - 1].activeClass = 'tag__container_active';
        });
        await this.view.updateTags();
    }

    #followEvent = (linkElement) => {
        UserModel.getProfile().then(
            (profile) => {
                let eid = linkElement.getAttribute('data-eid');
                let eventComponent = this.view.findEventComponent(Number(eid));

                if (!eventComponent) {
                    console.error('No component was found');
                    // TODO: do sth
                    return;
                }

                if (eventComponent.type === 'mid') {
                    return EventModel.joinMidEvent(profile.uid, eid)
                        .then((response) => eventComponent.state = true);
                } else {
                    console.log('we dont support that type yet');
                }

            },
            error => console.error(error)
        );
    };

    #unfollowEvent = (linkElement) => {
        UserModel.getProfile().then(
            (profile) => {
                let eid = linkElement.getAttribute('data-eid');
                let eventComponent = this.view.findEventComponent(Number(eid));

                if (!eventComponent) {
                    console.error('No component was found');
                    // TODO: do sth
                    return;
                }

                if (eventComponent.type === 'mid') {
                    EventModel.leaveMidEvent(profile.uid, eid)
                        .then((response) => eventComponent.state = false);
                } else {
                    console.log('we dont support that type yet');
                }

            },
            error => console.error(error)
        );
    };

    #setUpVoteButtons() {
        this.addEventHandler(
            document.querySelector('.feed-center__action-buttons'),
            'click',
            this.#voteHandler);
    }

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
            .then(() => this.#updateView())
            .catch(error => this.view.showFeedError(error));
    };

    /**
     * Handle click on like buttons
     * @param event
     */
    #voteHandler = (event) => {
        if (!event.target.matches('button')) {
            return;
        }

        if (this.userMessages.length !== 0) {
            showMessageWithRedirect(this.userMessages, 'Profile');
            return;
        }

        const isLike = event.target.matches('.re_btn__approve');
        // Get id-s
        const vote = {
            uid: this.uid,
            id: this.userList[this.currentUserNum].item.uid,
            value: isLike ? 1 : -1,
        };

        // Send request with vote
        EventModel.userVote(vote, isLike).then(
            (response) => {
                console.log(response);
            },
            (onerror) => {
                console.error(onerror);
            });

        // Show next item
        ++this.currentUserNum;
        if (this.currentUserNum < settings.pageLimit) {
            if (this.userList.length <= this.currentUserNum) { // empty list
                this.view.updateCenter(null);
            } else { // not empty list
                this.#updateView();
            }
        } else {
            // Go get next items
            this.currentUserNum = 0;
            ++this.currentPage;
            this.userList.length = 0;
            this.defaultFeedRequest.page = this.currentPage;
            this.#initDataList(this.defaultFeedRequest).then(
                (data) => {
                    this.#updateView();
                },
                (error) => {
                    console.error(error);
                    this.view.showError(error);
                });
        }
    };

    /**
     * Get users list to show in feed
     * @return {Promise<T>}
     */
    #initDataList = (request) => {
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

    /**
     * Render both columns
     * Show rendering icon if loading
     */
    #updateView() {
        this.view.updateUser()
            .then(this.#setUpVoteButtons());
    }
}
