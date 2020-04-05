'use strict';

import EventModel from 'Eventum/models/event-model.js';
import UserModel from 'Eventum/models/user-model.js';
import Controller from 'Eventum/core/controller.js';
import FeedUsersView from 'Eventum/views/feed-users-view.js';
import settings from 'Settings/config.js'
import SliderManager from "Blocks/slider/set-slider.js";
import {MIN_AGE, MAX_AGE} from "Eventum/utils/static-data.js";
import {highlightTag} from "Eventum/utils/tag-logic.js";

/**
 * @class FeedUsersController
 */
export default class FeedUsersController extends Controller {

    /**
     * Construct obj of ProfileSearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.usersSelected = false;
        this.list = null;
        this.tagList = [];
        this.currentPage = 1;
        this.currentItem = 0;
        EventModel.getTagList().then((tags) => {
            this.view = new FeedUsersView(parent, tags);
        });
        this.uid = null;
        this.sliderManager = new SliderManager();
    }


    /**
     * Create action
     */
    action() {
        super.action();
        UserModel.getProfile().then((user) => {
            this.uid = user.uid;
            this.#initDataList(1)
                .then((data) => {
                    this.#actionCallback(data, this.tagList, !this.usersSelected);
                });
        });
    }

    /**
     * Call render method from view and initialize event handlers
     * @param {Object} data
     * @param {Array} selectedTags
     * @param {boolean} isEvent
     */
    #actionCallback = (data, selectedTags, isEvent) => {
        this.view.render(data, selectedTags, isEvent);
        this.addEventHandler(document.querySelector('.feed__options_field'), 'click', highlightTag);
        if (data) {
            this.#setUpVoteButtons();
        }
        this.addEventHandler(document.getElementById('form'), 'submit', this.#getFilters());

        // Set two sliders and connect each other
        let sliders = document.querySelectorAll('.slider');
        this.sliderManager.setSliders(
            {slider1: sliders[0], initialValue1: 18},   // TODO: change to profile preferences
            {slider2: sliders[1], initialValue2: 25});
    };

    #setUpVoteButtons() {
        const approveBtn = document.getElementsByClassName('re_btn__approve')[0];
        approveBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.#voteHandler(!this.usersSelected, true);
        });

        const rejectBtn = document.getElementsByClassName('re_btn__reject')[0];
        rejectBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.#voteHandler(!this.usersSelected, false);
        });
    }

    #getFilters() {
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
        filters.keyWords = form.search_text.value.split(' ');

        // Get active tags
        form.querySelectorAll('.tag__container.tag__container__active').forEach((tag) => {
            filters.tags.push(tag.firstElementChild.innerText);

        });

        let otherFilters = form.querySelector('.feed__other_options');

        // Get genders
        let genderInputs = otherFilters.querySelectorAll('.feed__checkbox_label input');
        if (genderInputs.length === 2) {
            filters.men = genderInputs[0].checked;
            filters.women = genderInputs[1].checked;
        }

        // Get ages
        let ageSliderSpans = otherFilters.querySelectorAll('.slider__value');
        if (ageSliderSpans.length === 2) {
            filters.minAge = Number(ageSliderSpans[0].getAttribute('slider_value'));
            filters.maxAge = Number(ageSliderSpans[1].getAttribute('slider_value'));
        }

        console.log(filters);
        return filters;
    };

    #voteHandler = (isLike) => {
        const vote = {
            uid: this.uid,
            id: this.list[this.currentItem].uid,
            value: isLike ? 1 : -1,
        };
        if (this.usersSelected) {
            EventModel.userVote(vote, isLike)
                .then((response) => {
                    console.log(response);
                }).catch((onerror) => {
                console.error(onerror);
            });
        } else {
            EventModel.eventVote(vote, isLike)
                .then((response) => {
                    console.log(response);
                }).catch((onerror) => {
                console.error(onerror);
            });
        }

        ++this.currentItem;
        if (this.currentItem < settings.pageLimit) {
            if (this.list.length <= this.currentItem) {
                this.view.updateData(null, !this.usersSelected);
            } else {
                this.view.updateData(this.list[this.currentItem], !this.usersSelected);
                this.#setUpVoteButtons();
            }
        } else {
            this.currentItem = 0;
            ++this.currentPage;
            this.#initDataList(this.currentPage)
                .then((data) => {
                    this.view.updateData(data, !this.usersSelected);
                    this.#setUpVoteButtons();
                });
            // TODO: create request for the next page of events or users
        }
    };

    #initDataList = (page) => {
        if (this.usersSelected) {
            return EventModel.getFeedUsers({page: page, uid: this.uid, limit: settings.pageLimit, query: ''})
                .then((users) => {
                    this.list = users;
                    if (this.list) {
                        return this.list[0];
                    }
                    return null;
                }).catch((onerror) => {
                    console.error(onerror);
                    return onerror;
                });
        } else {
            return EventModel.getFeedEvents({page: 1, uid: this.uid, limit: settings.pageLimit, query: ''})
                .then((events) => {
                    this.list = events;
                    if (this.list) {
                        return this.list[0];
                    }
                    return null;
                }).catch((onerror) => {
                    console.error(onerror);
                    return onerror;
                });
        }
    };

    #selectTag = (dataField) => {
        // TODO: create ajax request to server for new page of events
        // TODO: redraw main block
        return new Promise(resolve => resolve);
    };
}
