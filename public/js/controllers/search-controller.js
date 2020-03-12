'use strict';

import Controller from '../core/controller.js';
import SearchView from '../views/search-view.js';

/**
 * @class SearchController
 */
export default class SearchController extends Controller {

    /**
     * Construct obj of SearchController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.searching = false;
        this.view = new SearchView(parent);
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
        document.querySelectorAll('.search_tag').forEach((tag) => {
            tag.addEventListener('click', this._highlightTag);
        });
        document.getElementById('form').addEventListener('submit', this._setOptions)
    }

    _highlightTag(event) {
        event.preventDefault();

        let hideButton = this.querySelector('.x_btn');
        if (this.style.opacity === '0.5') {
            this.style.opacity = '1';
            hideButton.style.display = 'block';
        } else {
            this.style.opacity = '0.5';
            hideButton.style.display = 'none';
        }
    }

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
            photos: ['ProfilePhotos/2.jpg'],
        };

        let columns = this.parent.getElementsByClassName('column');
        columns[1].innerHTML = Handlebars.templates['public/js/templates/search/photos-column']({profile: this.currentProfile});
        columns[2].innerHTML = Handlebars.templates['public/js/templates/search/profile-column']({profile: this.currentProfile, events: this.currentProfileEvents});
    }
}