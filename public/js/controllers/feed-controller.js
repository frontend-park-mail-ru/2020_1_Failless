'use strict';

import EventModel from 'Eventum/models/event-model.js';
import UserModel from 'Eventum/models/user-model.js';
import Controller from 'Eventum/core/controller.js';
import FeedView from 'Eventum/views/feed-view.js';
import settings from 'Settings/config.js';
import SliderManager from 'Blocks/slider/set-slider.js';
import {MAX_AGE, MIN_AGE, staticTags} from 'Eventum/utils/static-data.js';
import {highlightTag} from 'Eventum/utils/tag-logic.js';
import {profileCheck} from 'Eventum/utils/user-utils.js';
import {showMessageWithRedirect} from 'Eventum/utils/render.js';
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
        this.sliderManager = new SliderManager();
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
        UserModel.getProfile().then(user => this.defaultFeedRequest.uid = user.uid)
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
            console.log(user);
            this.model.userMessages = profileCheck(user);
            this.model.feedRequest.uid = user.uid;
            if (user.tags) {
                this.model.feedRequest.tags = user.tags.map(tag => tag.tag_id);
            }
            this.#initFilters(user.tags);

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
                        {type: 'click', handler: () => {document.querySelector('.feed__filters').classList.toggle('feed__filters_active');}},
                    ]
                },
                {
                    attr: 'removeFiltersActive',
                    many: true,
                    events: [
                        {type: 'click', handler: () => {document.querySelector('.feed__filters').classList.remove('feed__filters_active');}},
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

    /**
     *  Initialize filters with user preferences
     *  TODO: get previous settings
     */
    async #initFilters(userTags) {
        // Set tags active equal to user's own tags
        if (userTags) {
            this.model.tags.forEach(tag => {
                if (userTags.includes(tag.name)) {
                    tag.active_class = 'tag__container__active';
                }
            });
            this.view.updateTags();
        }

        // Set two sliders and connect each other
        let sliders = document.querySelectorAll('.slider');
        this.sliderManager.setSliders(
            {slider1: sliders[0], initialValue1: 18},
            {slider2: sliders[1], initialValue2: 25});
    }

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

        const form = document.getElementById('form');
        let filters = {
            tags: [],
            keyWords: [],
            men: true,
            women: true,
            minAge: MIN_AGE,
            maxAge: MAX_AGE,
        };

        // Get keywords (TODO: add more separators)
        if (form.search_text.value.split(' ')[0]) {
            filters.keyWords = form.search_text.value.split(' ');
        }

        // Get active tags
        form.querySelectorAll('.tag__container.tag__container_active').forEach((tag) => {
            filters.tags.push(+tag.firstElementChild.getAttribute('data-id'));
        });

        let otherFilters = form.querySelector('.feed__other-options');

        // Get genders
        let genderInputs = otherFilters.querySelectorAll('.feed__checkbox-label input');
        if (genderInputs.length === 2) {
            filters.men = genderInputs[0].checked;
            filters.women = genderInputs[1].checked;
        }

        // Get ages
        let ageSliderSpans = otherFilters.querySelectorAll('.slider__value');
        filters.minAge = Number(ageSliderSpans[0].getAttribute('slider_value'));
        filters.maxAge = Number(ageSliderSpans[1].getAttribute('slider_value'));

        let request = {
            uid: this.uid,
            page: this.currentPage,
            limit: 10,
            query: String(...filters.keyWords),
            tags: filters.tags,
            Location: null,
            minAge: filters.minAge,
            maxAge: filters.maxAge,
            men: filters.men,
            women: filters.women,
        };

        this.#initDataList(request).then(
            (data) => {
                this.#updateView();
            },
            (error) => {
                console.error(error);
                this.view.showError(error);
            }
        );
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
                console.log(users);
                if (users) {
                    users.forEach((user) => {
                        this.model.userList.push(user);
                    });
                }
                return users;
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
