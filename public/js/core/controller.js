'use strict';

import createHeader from 'Eventum/core/header.js';
import UserModel from 'Eventum/models/user-model.js';
import {logoutRedirect} from 'Eventum/utils/user-utils.js';
import router from 'Eventum/core/router.js';

/**
 * @class Basic controller class
 */
export default class Controller {

    /**
     * Construct obj of basic controller class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
        this.eventHandlers = [];

        this.scrollUp = 'header__scroll_up';
        this.scrollDown = 'header__scroll_down';
        this.lastScroll = 0;
    }

    /**
     * virtual destructor
     */
    destructor() {
        if (this.eventHandlers.length !== 0) {
            for (const nodeVal of this.eventHandlers) {
                for (const eventVal of nodeVal.events) {
                    this.removeEventHandler(nodeVal.htmlNode, eventVal.event);
                }
            }
        }
        this.parent.innerHTML = '';
    }

    /**
     * Create action and render header
     */
    action() {
        UserModel.getLogin().then((user) => {
            createHeader(this.parent, Object.prototype.hasOwnProperty.call(user, 'uid'));
        }).catch((onerror) => {
            createHeader(this.parent, false);
            console.log('No internet connection', onerror);
        }).then(() => {
            this.addEventHandler(
                document.getElementsByClassName('header__manage')[0],
                'click',
                this.#controlBtnPressed);
            this.addEventHandler(
                document.getElementsByClassName('header__logo gradient-text')[0],
                'click',
                this.#homeRedirect);
        });
    }

    /**
     * Handle button pressed event on the header block by button url
     * @param {Event} event
     * @private
     */
    #controlBtnPressed = (event) => {
        event.preventDefault();
        let link = null;
        if (event.target.tagName === 'DIV') {
            link = event.target.querySelector('.header__item__link');
        } else if (event.target.tagName === 'A') {
            link = event.target;
        } else {
            return;
        }

        let href = link.getAttribute('href');
        if (href === '') {
            href = '/';
        }

        if (href === '/logout') {
            logoutRedirect(event);
            return;
        }

        router.redirectForward(href);
    };


    /**
     * Handle click on home event
     * @param {Event} event
     */
    #homeRedirect = (event) => {
        event.preventDefault();

        router.redirectForward('/');
    };

    #setActiveLink = () => {
        // TODO: remove all active links
        //  Add active link on chosen index (look in my-controller.js)
    };

    /*
    [{
      htmlNode: домэлемент,
      events: [{
            event: 'click',
            handler: callback
      }]
    }]
    */
    addEventHandler = (node, event, handler) => {
        let foundNode = false;
        let foundEvent = false;
        if (node) {
            if (this.eventHandlers.length !== 0) {
                for (const nodeVal of this.eventHandlers) {
                    if (nodeVal.htmlNode == node) {
                        foundNode = true;
                        for (const eventVal of nodeVal.events) {
                            if (eventVal.event == event) {
                                foundEvent = true;
                                break;
                            }
                        }
                        if (!foundEvent) {
                            node.addEventListener(event, handler);
                            nodeVal.events.push({
                                event: event,
                                handler: handler,
                            });
                        }
                        break;
                    }
                }
            }
            if (!foundNode) {
                node.addEventListener(event, handler);
                this.eventHandlers.push({
                    htmlNode: node,
                    events: [{
                        event: event,
                        handler: handler,
                    }]
                });
            }
        }
    };

    removeEventHandler = (node, event) => {
        if (this.eventHandlers.length !== 0) {
            this.eventHandlers = [...this.eventHandlers.filter(nodeVal => {
                if (nodeVal.htmlNode == node) {
                    nodeVal.events = [...nodeVal.events.filter(eventVal => {
                        if (eventVal.event == event) {
                            node.removeEventListener(event, eventVal.handler);
                            return false;
                        } else {
                            return true;
                        }
                    })];
                    return false;
                } else {
                    return true;
                }
            })];
        }
    };

    removeErrorMessage = (event) => {
        event.preventDefault();

        event.target.classList.remove('input__auth_incorrect');
        let errorElement = event.target.parentNode.getElementsByClassName('validation-error')[0];
        if (errorElement) {
            errorElement.remove();
        }
    };

    /**
     * Create slow header hiding and showing during scroll
     */
    stickyHeader = () => {
        this.header = document.querySelector('.header');
        if (!this.header) {
            this.header = document.querySelector('header');
        }

        const currentScroll = window.pageYOffset;

        // Reached top
        if (currentScroll === 0) {
            this.header.classList.remove(this.scrollUp);
            return;
        }

        if (currentScroll > this.lastScroll && !this.header.classList.contains(this.scrollDown)) {
            // Scroll down
            this.header.classList.remove(this.scrollUp);
            this.header.classList.add(this.scrollDown);
        } else if (currentScroll < this.lastScroll && this.header.classList.contains(this.scrollDown)) {
            // Scroll up
            this.header.classList.remove(this.scrollDown);
            this.header.classList.add(this.scrollUp);
        }
        this.lastScroll = currentScroll;
    };
}
