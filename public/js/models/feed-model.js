'use strict';

import Model from 'Eventum/core/model';
import settings from 'Settings/config';
import {STATIC_TAGS, MIN_AGE, MAX_AGE} from 'Eventum/utils/static-data';

let feedModelSymbol = Symbol('Model for feed');
let feedModelEnforcer = Symbol('The only object that can create FeedModel');

export default class FeedModel extends Model {
    constructor(enforcer) {
        super();
        if (enforcer !== feedModelEnforcer) {
            throw 'Instantiation failed: use FeedModel.instance instead of new()';
        }

        this.userList = [];
        this.tagList = [...STATIC_TAGS];
        this.feedRequest = {
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
        this.currentPageNumber = 1;
        this.currentUserNumber = 0;
        this.userMessages = [];
    }

    static get instance() {
        if (!this[feedModelSymbol])
            this[feedModelSymbol] = new FeedModel(feedModelEnforcer);
        return this[feedModelSymbol];
    }

    static set instance(v) {
        throw 'Can\'t change constant property!';
    }

    get tags() {
        return this.tagList;
    }

    set tags(newTags) {
        this.tagList = [...newTags];
    }

    get currentUser() {
        return this.userList[this.currentUserNumber];
    }
}

// https://medium.com/@frontman/%D1%80%D0%B5%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%BE%D0%B4%D0%B8%D0%BD%D0%BE%D1%87%D0%BA%D0%B8-%D0%B2-js-20d64da9d44b