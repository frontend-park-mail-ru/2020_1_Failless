'use strict';

import Controller from '../core/controller.js';
import PrivateView from '../views/private-view.js';

/**
 * @class PrivateController
 */
export default class PrivateController extends Controller {

    /**
     * construct object of PrivateController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new PrivateView(parent);
        this.redirects = [
            this._chatRedirect,
            this._mailRedirect,
            this._profileRedirect,
        ];
        this.circles = null;

        document.addEventListener('DOMContentLoaded', (event) => {
            this.circles = document.getElementsByClassName('circle');
            for (let iii = 0; iii < this.circles.length; iii++) {
                this.circles[iii].addEventListener('click', this.redirects[iii].bind(this), false);
            }
        });
    }

    /**
     * Create action
     */
    action() {
        super.action();
    }

    _chatRedirect = (event) => {
        event.preventDefault();

        console.log('chat redirects');

        // window.history.pushState({}, '', '/private/chat');
        // window.history.pushState({}, '', '/private/chat');
        // window.history.back();
    };

    _mailRedirect = (event) => {
        event.preventDefault();

        console.log('mail redirect');

        // window.history.pushState({}, '', '/private/mail');
        // window.history.pushState({}, '', '/private/mail');
        // window.history.back();
    };

    _profileRedirect = (event) => {
        event.preventDefault();

        console.log('profile redirect');

        // window.history.pushState({}, '', '/private/profile');
        // window.history.pushState({}, '', '/private/profile');
        // window.history.back();
    };

    _highlightCircle(index) {
        Array.prototype.forEach.call(this.circles, (circle) => {
            circle.classList.remove('circle__active');
        });
        this.circles[index].classList.add('circle__active');
    }
}