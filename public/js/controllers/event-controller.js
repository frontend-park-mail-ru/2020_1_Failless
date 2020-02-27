'use strict';

import Controller from '../core/controller.js';
import EventView from '../views/event-view.js';
import EventModel from '../models/event-model.js';

/**
 * @class EventController
 */
export default class EventController extends Controller {

    /**
     * Construct obj of EventController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent, false);
        this.event = null;
        this.view = new EventView(parent);
    }

    /**
     * Create action
     */
    action(routerInstance) {
        EventModel.getEvent().then(
            (event) => {
                this.event = event;
                this.parent.innerHTML = "";

                this.view.render(this.event);
            },
            (error) => {}
        );
    }
}