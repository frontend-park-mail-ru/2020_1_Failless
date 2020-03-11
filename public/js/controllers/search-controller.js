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
        this.view = new SearchView(parent);
    }

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();
        document.querySelectorAll('.search_tag').forEach((tag) => {
            tag.addEventListener('click', this._highlightTag);
        });
        document.getElementById('form').addEventListener('submit', this._searchHandler)
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

    _searchHandler = (event) => {
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
    }
}