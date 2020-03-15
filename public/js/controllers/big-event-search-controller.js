'use strict';

import Controller from '../core/controller.js';
import BigEventSearchView from '../views/big-event-search-view.js';
import EventModel from '../models/event-model.js';

/**
 * @class SearchController
 */
export default class BigEventSearchController extends Controller {

    /**
     * Construct obj of BigEventSearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.searching = false;
        this.view = new BigEventSearchView(parent);
    }

    /**
     * Create action
     */
    action() {
        super.action();
        EventModel.getEvents()
            .then(events => {
                this.view.render(events);
                document.querySelectorAll('.search_tag').forEach((tag) => {
                    tag.addEventListener('click', this.#highlightTag);
                });
                document.getElementById('form').addEventListener('submit', this._setOptions)
            }).catch(onerror => {
                console.error(onerror);
            });

        // todo: create request to backend for taking events list

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

    _setOptions = (event) => {
        event.preventDefault();

        const form = document.getElementById('form');

        let searchOptions = {
            text: form.search_text.value,
            tags: [],
        };

        form.querySelectorAll('.search_tag').forEach((tag) => {
            if (tag.style.opacity === '1') {
                searchOptions.tags.push(tag.getElementsByClassName('tag tag_size_middle')[0].innerText);
            }
        });

        console.log(searchOptions);

        // TODO: Send searchOptions to back-end

        if (!this.searching) {
            this.searching = true;
            this._getNextPerson();
        } // else don't
        // cause changing settings shouldn't change current person on the screen
    };

    _getNextPerson(event) {
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

        let columns = this.parent.getElementsByClassName('column');
        columns[1].innerHTML = Handlebars.templates['public/js/templates/search/photos-column']({profile: this.currentProfile});
        columns[2].innerHTML = Handlebars.templates['public/js/templates/search/profile-column']({profile: this.currentProfile, events: this.currentProfileEvents});
    }
}