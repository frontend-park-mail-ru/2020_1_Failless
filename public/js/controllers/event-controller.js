'use strict';

import Controller from '../core/controller.js';
import EventView from '../views/event-view.js';
import EventModel from '../models/event-model.js';
import Header from '../core/header.js';

/**
 * @class EventController
 */
export default class EventController extends Controller {

    /**
     * Construct obj of EventController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.event = null;
        this.view = new EventView(parent);
    }

    /**
     * Create action
     */
    action() {
        EventModel.getEvent().then(
            (event) => {
                this.event = event;
                this.view.render(this.event, this.user);
            },
            (error) => {
                console.error(error.toString());
            }
        );
    }
}