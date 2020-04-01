'use strict';

import Controller from '../core/controller.js';
import FeedUsersView from '../views/feed-users-view.js';
import SetSliders from "../../blocks/slider/set-slider.js";

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
        this.view = new FeedUsersView(parent);
    }

    searching;
    currentProfile;
    currentProfileEvents;

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();
        document.querySelectorAll('.search-tag').forEach((tag) => {
            tag.addEventListener('click', this.#highlightTag);
        });
        document.getElementById('form').addEventListener('submit', this.#setOptions);
        SetSliders(18, 60, 25);
    }

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

    #getNextPerson(event) {
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
    }
}