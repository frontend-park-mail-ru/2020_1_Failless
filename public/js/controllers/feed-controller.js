'use strict';

import EventModel from 'Eventum/models/event-model.js';
import UserModel from 'Eventum/models/user-model.js';
import Controller from 'Eventum/core/controller.js';
import FeedView from 'Eventum/views/feed-view.js';
import settings from 'Settings/config.js';
import SliderManager from 'Blocks/slider/set-slider.js';
import {MAX_AGE, MIN_AGE, staticTags} from 'Eventum/utils/static-data.js';
import {highlightTag} from 'Eventum/utils/tag-logic.js';
import {fullProfileCheck} from 'Eventum/utils/user-utils.js';
import {showMessageWithRedirect} from 'Eventum/utils/render.js';

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
        this.dataList = []; // {item, followers}
        this.tagList = []; // заглушка
        this.currentPage = 1;
        this.currentItem = 0;
        this.view = new FeedView(parent, staticTags);
        this.uid = null;
        this.sliderManager = new SliderManager();
        this.userMessages = [];
        this.defaultFeedRequest = {
            uid: this.uid,
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
    }


    /**
     * Action when page renders for the first time
     */
    action() {
        super.action();
        this.view.render(this.tagList);
        UserModel.getProfile().then((user) => {
            // Check if user has filled profile
            this.userMessages = fullProfileCheck(user);
            this.uid = user.uid;
            this.defaultFeedRequest.uid = this.uid;
            this.defaultFeedRequest.tags = user.tags;

            // Fetch content to show
            this.#initDataList(this.defaultFeedRequest).then(
                (data) => {
                    this.#updateAll();
                },
                (error) => {
                    console.error(error);
                    this.view.showError(error);
                });
            this.#initFilters();
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
            ]);
        });
    }

    /**
     *  Initialize filters with user preferences
     */
    async #initFilters() {
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

        if (this.userMessages.length !== 0) {
            showMessageWithRedirect(this.userMessages, 'Profile');
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
            limit: 10,
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
                this.#updateAll();
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
            uid:    this.uid,
            id:     this.dataList[this.currentItem].item.uid,
            value:  isLike ? 1 : -1,
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
        ++this.currentItem;
        if (this.currentItem < settings.pageLimit) {
            if (this.dataList.length <= this.currentItem) { // empty list
                this.view.updateCenter(null);
            } else { // not empty list
                this.#updateAll();
            }
        } else {
            // Go get next items
            this.currentItem = 0;
            ++this.currentPage;
            this.dataList.length = 0;
            this.defaultFeedRequest.page = this.currentPage;
            this.#initDataList(this.defaultFeedRequest).then(
                (data) => {
                    this.#updateAll();
                },
                (error) => {
                    console.error(error);
                    this.view.showError(error);
                });
        }
    };

    /**
     * Get either events or users list to show in feed
     * @return {Promise<T>}
     */
    #initDataList = (request) => {
        console.log(request);
        return EventModel.getFeedUsers(request).then(
            (users) => {
                if (users) {
                    console.log(users);
                    users.forEach((user) => {
                        this.dataList.push(
                            {
                                item: user,
                                followers: {
                                    personalEvents: user.events,
                                    subscriptions: user.subscriptions,
                                },
                            })
                    });
                    return this.dataList[0];
                } else {
                    return null;
                }
            },
            (error) => {
                console.error(error);
                throw new Error(error);
            });
    };

    /**
     * Render both columns
     * Show rendering icon if loading
     */
    #updateAll() {
        // Show none
        if (!this.dataList[this.currentItem]) {
            this.view.updateCenter(null);
            this.view.updateRight(null);
            return;
        }

        // Render center column
        this.view.updateCenter(this.dataList[this.currentItem].item);
        this.#setUpVoteButtons();

        // Render right column
        this.view.showLoadingRight();
        this.view.updateRight(this.dataList[this.currentItem].followers)
    }
}
