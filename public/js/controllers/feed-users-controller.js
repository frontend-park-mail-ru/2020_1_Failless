'use strict';

import Controller from '../core/controller.js';
import FeedUsersView from '../views/feed-users-view.js';
import SetSliders from '../../blocks/slider/set-slider.js';
import EventModel from '../models/event-model.js';
import UserModel from '../models/user-model.js';
import settings from '../../settings/config.js'

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
        this.searching = false;
        this.usersSelected = false;
        this.list = null;
        this.currentPage = 1;
        this.currentItem = 0;
        this.view = new FeedUsersView(parent);
        this.uid = null;
    }

    searching;
    currentProfile;
    currentProfileEvents;

    /**
     * Create action
     */
    action() {
        super.action();
        UserModel.getProfile().then((user) => {
            this.uid = user.uid;
            this.#initDataList(1)
                .then((data) => {
                    this.#actionCallback(data, [], !this.usersSelected);
                });
        });
    }

    /**
     *
     * @param {Object} data
     * @param {Array} selectedTags
     * @param {boolean} isEvent
     */
    #actionCallback = (data, selectedTags, isEvent) => {
        this.view.render(data, selectedTags, isEvent);
        document.querySelectorAll('.search-tag').forEach((tag) => {
            tag.addEventListener('click', this.#highlightTag);
        });
        if (data) {
            this.#setUpVoteButtons();
        }
        document.getElementById('form').addEventListener('submit', this.#setOptions);
        SetSliders(18, 60, 25);
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

    /**
     *
     * @param {Event} event
     */
    #highlightTag = (event) => {
        event.preventDefault();

        let hideButton = this.querySelector('.x_btn');
        if (this.style.opacity === '0.5') {
            this.style.opacity = '1';
            hideButton.style.display = 'block';
        } else {
            this.style.opacity = '0.5';
            hideButton.style.display = 'none';
        }
    };

    #setOptions = (event) => {
        event.preventDefault();
        const form = document.getElementById('form');
        let searchOptions = {
            text: form.search_text.value,
            tags: [],
        };

        form.querySelectorAll('.search-tag').forEach((tag) => {
            if (tag.style.opacity === '1') {
                searchOptions.tags.push(tag.getElementsByClassName('tag tag_size_middle')[0].innerText);
            }
        });

        console.log(searchOptions);

        // TODO: Send searchOptions to back-end

        if (!this.searching) {
            this.searching = true;
            this.#getNextPerson();
        } // else don't
        // cause changing settings shouldn't change current person on the screen
    };

    #getNextPerson = (event) => {
        if (event) {
            event.preventDefault();
        }

        // TODO: Send request to back and fill currentProfile

        this.currentProfile = {
            name: 'Another Egor',
            age: 30,
            about: 'Вон другой парень',
            photos: ['/ProfilePhotos/2.jpg'],
        };

        let columns = this.parent.getElementsByClassName('feed__column');
        const template = {
            profile: this.currentProfile,
            events: this.currentProfileEvents,
            isEvents: false,
        };
        columns[1].innerHTML = Handlebars.templates['feed-center']({profile: this.currentProfile});
        columns[2].innerHTML = Handlebars.templates['feed-right']({
            profile: this.currentProfile,
            events: this.currentProfileEvents
        });
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
    }
}