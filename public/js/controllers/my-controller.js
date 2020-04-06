'use strict';

import Controller from 'Eventum/core/controller.js';
import MyView from 'Eventum/views/my-view.js';

/**
 * @class MyController
 */
export default class MyController extends Controller {

    /**
     * construct object of MyController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new MyView(parent);
        this.redirects = [
            this.#chatRedirect,
            this.#mailRedirect,
            this.#profileRedirect,
        ];
    }

    /**
     * Create action
     */
    action() {
        super.action();
    }

    /**
     * Chat redirect
     * @param {Event} event
     */
    #chatRedirect = (event) => {
        event.preventDefault();

        console.log('chat redirects');

        // window.history.pushState({}, '', '/my/chat');
        // window.history.pushState({}, '', '/my/chat');
        // window.history.back();
    };

    /**
     * Redirect to mail page
     * @param {Event} event
     */
    #mailRedirect = (event) => {
        event.preventDefault();

        console.log('mail redirect');

        // window.history.pushState({}, '', '/my/mail');
        // window.history.pushState({}, '', '/my/mail');
        // window.history.back();
    };

    /**
     * Redirect to profile page
     * @param {Event} event
     */
    #profileRedirect = (event) => {
        event.preventDefault();

        console.log('profile redirect');

        // window.history.pushState({}, '', '/my/profile');
        // window.history.pushState({}, '', '/my/profile');
        // window.history.back();
    };

    // highlightCircle(index) {
    //     Array.prototype.forEach.call(this.circles, (circle) => {
    //         circle.classList.remove('circle__active');
    //     });
    //     if (this.circles[index] !== undefined) {
    //         this.circles[index].classList.add('circle__active');
    //     }
    // }
}