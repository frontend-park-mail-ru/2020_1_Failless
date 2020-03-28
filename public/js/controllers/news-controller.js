'use strict';

import Controller from '../core/controller.js';
import NewsView from '../views/news-view.js';
import UserModel from '../models/user-model.js';

/**
 * @class NewsController
 */
export default class NewsController extends Controller {

    /**
     * construct object of MyController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new NewsView(parent);
    }

    /**
     * Create action
     */
    action() {
        super.action();
        UserModel.getLogin().then((user) => {
            if (Object.prototype.hasOwnProperty.call(user, 'uid')) {
                    console.log(user);
                    this.view.render('Here is news');
                } else {
                    this.view.render('Auth first!');
                    console.error('You have no rights');
                }
            }).catch(onerror => {
            console.error(onerror);
        });
        this.view.render('Base view?');    
    }

}