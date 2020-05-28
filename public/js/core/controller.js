'use strict';

import createHeader from 'Eventum/core/header';
import UserModel from 'Eventum/models/user-model';
import {logoutRedirect} from 'Eventum/utils/user-utils';
import router from 'Eventum/core/router';
import {detectMobile} from 'Eventum/utils/basic';
import TextConstants from 'Eventum/utils/language/text';
import Snackbar from 'Blocks/snackbar/snackbar';

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
        UserModel.getLogin()
            .then((user) => createHeader(this.parent, Object.prototype.hasOwnProperty.call(user, 'uid')))
            .catch(() => {
                createHeader(this.parent, false);
                Snackbar.instance.addMessage('No internet connection');})
            .then(() =>
                this.initHandlers([
                    {
                        attr: 'headerItemPressed',
                        events: [
                            {type: 'click', handler: this.#controlBtnPressed},
                        ]
                    },
                    {
                        attr: 'homeRedirect',
                        events: [
                            {type: 'click', handler: () => {router.redirectForward('/');}},
                        ]
                    },
                    {
                        attr: 'searchRedirect',
                        events: [
                            {type: 'click', handler: () => {router.redirectForward('/search');}},
                        ]
                    },
                ])
            );
    }

    /**
     * Add event handlers
     *      attr - attribute of HTML element data-bind-event="attr"
     *      many = true, in case many elements have the same eventHandler
     *             be careful with type of event
     *      events - that's pretty self explanatory
     *
     * @param eventMap {({attr: string, events: [{handler: function(Event): (undefined), type: string}]}|{attr: string, many: boolean, events: [{handler: function(*): void, type: string}, {handler: function(Event): void, type: string}]})[]}
     */
    initHandlers(eventMap) {
        eventMap.forEach((eMap) => {
            if (eMap.many) {
                // TODO: add result of querySelector to view.vDOM
                const nodes = document.querySelectorAll(`[data-bind-event="${eMap.attr}"]`);
                nodes.forEach((node) => {
                    eMap.events.forEach((ev) => {
                        this.addEventHandler(node, ev.type, ev.handler);
                    });
                });
            } else {
                // TODO: add result of querySelector to view.vDOM
                const node = document.querySelector(`[data-bind-event="${eMap.attr}"]`);
                eMap.events.forEach((ev) => {
                    this.addEventHandler(node, ev.type, ev.handler);
                });
            }
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
        } else if (href === '/logout') {
            logoutRedirect(event);
            return;
        } else if (href === '#!') {
            return;
        } else if (href.startsWith('lang')) {
            Promise.all([
                this.view.showGlobalLoading(),
                TextConstants.setCurrentLanguage(href.slice(5))
            ]).then(() => {
                location.reload();
            });
            return;
        }

        router.redirectForward(href);
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
        if (!this.header || !this.header_checkbox) {
            this.header = document.querySelector('.header');
            this.header_checkbox = this.header.querySelector('input[type="checkbox"]');
        }

        if (detectMobile()) {
            this.header_checkbox.checked = false;
        }

        const currentScroll = window.pageYOffset;

        // Reached top
        if (currentScroll <= 0) {
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
