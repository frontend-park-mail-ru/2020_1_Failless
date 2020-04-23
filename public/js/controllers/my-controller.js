'use strict';

import Controller from 'Eventum/core/controller.js';
import MyView from 'Eventum/views/my-view.js';
import router from 'Eventum/core/router.js';

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
        router.redirectForward('/my/chat');
    };

    /**
     * Redirect to mail page
     * @param {Event} event
     */
    #mailRedirect = (event) => {
        event.preventDefault();

        console.log('mail redirect');

        // router.redirectForward('/my/mail');
    };

    /**
     * Redirect to profile page
     * @param {Event} event
     */
    #profileRedirect = (event) => {
        event.preventDefault();

        router.redirectForward('/my/profile');
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