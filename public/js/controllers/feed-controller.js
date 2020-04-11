'use strict';

import EventModel from 'Eventum/models/event-model.js';
import UserModel from 'Eventum/models/user-model.js';
import Controller from 'Eventum/core/controller.js';
import FeedUsersView from 'Eventum/views/feed-users-view.js';
import settings from 'Settings/config.js';
import SliderManager from 'Blocks/slider/set-slider.js';
import {MIN_AGE, MAX_AGE, staticTags} from 'Eventum/utils/static-data.js';
import {highlightTag} from 'Eventum/utils/tag-logic.js';

/**
 * @class FeedController
 */
export default class FeedController extends Controller {

    /**
     * Construct obj of ProfileSearchController class
     * @param {HTMLElement} parent
     * @param {boolean} users - true, events - false
     */
    constructor(parent, users) {
        super(parent);
        this.usersFeed = users;
        this.dataList = []; // {item, followers}
        this.tagList = []; // заглушка
        this.currentPage = 1;
        this.currentItem = 0;
        this.view = new FeedUsersView(parent, staticTags);
        EventModel.getTagList().then(
            (tags) => {
                if (tags) {
                    this.view = new FeedUsersView(parent, tags);
                }
            });
        this.uid = null;
        this.sliderManager = new SliderManager();
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
     * Create action
     */
    action() {
        super.action();
        UserModel.getProfile().then((user) => {
            this.uid = user.uid;
            this.defaultFeedRequest.uid = this.uid;
            this.defaultFeedRequest.tags = user.tags;
            // Show landing page with loading
            // TODO: get selected tags from history
            this.view.render(this.tagList, !this.usersFeed);

            // Fetch content to show
            this.#initDataList(this.defaultFeedRequest).then(
                (data) => {
                    this.#updateAll();
                },
                (error) => {
                    console.error(error);
                    this.view.showError(error);
                });
        });
    }

    /**
     *
     * @param data
     */
    #initMainHandlers(data) {
        this.addEventHandler(document.querySelector('.feed__options-field'), 'click', highlightTag);
        if (data) {
            this.#setUpVoteButtons();
        }
        this.addEventHandler(document.getElementById('form'), 'submit', this.#applyFilters);

        // TODO: change initialValue to profile preferences
        // Set two sliders and connect each other
        let sliders = document.querySelectorAll('.slider');
        this.sliderManager.setSliders(
            {slider1: sliders[0], initialValue1: 18},
            {slider2: sliders[1], initialValue2: 25});
        if (!this.usersFeed) {
            this.sliderManager.setSlider(sliders[2], 5);
        }
    }

    #setUpVoteButtons() {
        this.addEventHandler(
            document.querySelector('.re_btn__approve'),
            'click',
            (event) => {
                event.preventDefault();
                this.#voteHandler(true);
            });
        this.addEventHandler(
            document.querySelector('.re_btn__reject'),
            'click',
            (event) => {
                event.preventDefault();
                this.#voteHandler(false);
            });
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

        // Get limit
        if (!this.usersFeed) {
            filters.limit = Number(ageSliderSpans[2].getAttribute('slider_value'));
            request.user_limit = filters.limit;
        }

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
     * @param isLike
     */
    #voteHandler = (isLike) => {
        // Get id-s
        const vote = {
            uid: this.uid,
            id: null,
            value: isLike ? 1 : -1,
        };

        // Send request with vote
        if (this.usersFeed) {
            vote.id = this.dataList[this.currentItem].item.uid;
            EventModel.userVote(vote, isLike).then(
                (response) => {
                    console.log(response);
                },
                (onerror) => {
                    console.error(onerror);
                });
        } else {
            vote.id = this.dataList[this.currentItem].item.eid;
            EventModel.eventVote(vote, isLike).catch(
                (onerror) => {
                    console.error(onerror);
                });
        }

        // Show next item
        ++this.currentItem;
        if (this.currentItem < settings.pageLimit) {
            if (this.dataList.length <= this.currentItem) { // empty list
                this.view.updateCenter(null, !this.usersFeed);
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
        if (this.usersFeed) {
            return EventModel.getFeedUsers(request).then(
                (users) => {
                    if (users) {
                        users.forEach((user) => {
                            console.log(user.events);
                            this.dataList.push(
                                {
                                    item: user,
                                    followers: {
                                        personalEvents: user.events,
                                        subscriptions: undefined,
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
        } else {
            return EventModel.getFeedEvents(request).then(
                (events) => {
                    if (events) {
                        events.forEach((event) => {
                            this.dataList.push(
                                {
                                    item: event,
                                    followers: undefined,
                                });
                            const len = this.dataList.length;
                            EventModel.getEventFollowers(event.eid).then(
                                (followers) => {
                                    this.dataList[len - 1].followers = followers;
                                }
                            )
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
        }
    };

    /**
     * Render both columns
     * Show rendering icon if loading
     */
    #updateAll() {
        // Show none
        if (!this.dataList[this.currentItem]) {
            this.view.updateCenter(null, !this.usersFeed);
            this.view.updateRight(null, !this.usersFeed);
            return;
        }

        // Render center column
        this.view.updateCenter(this.dataList[this.currentItem].item, !this.usersFeed);

        // Render right column
        this.view.showLoadingRight();
        this.#initMainHandlers(this.dataList[this.currentItem].item);
        if (this.dataList[this.currentItem].followers === undefined) {
            if (this.usersFeed) {
                // TODO: Load subscriptions
                this.view.updateRight(this.dataList[this.currentItem].followers, !this.usersFeed);
            } else {
                console.log('here2');
                EventModel.getEventFollowers(this.dataList[this.currentItem].item.eid).then(
                    (followers) => {
                        this.view.updateRight(followers, !this.usersFeed);
                    },
                    (error) => {
                        console.error(error);
                        this.view.showErrorRight(error);
                    });
            }
        } else {
            console.log(this.dataList[this.currentItem].followers);
            this.view.updateRight(this.dataList[this.currentItem].followers, !this.usersFeed);
        }
    }
}
