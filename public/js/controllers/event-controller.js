'use strict';

import Controller from '../core/controller.js';
import EventView from '../views/event-view.js';
import EventModel from '../models/event-model.js';

export default class EventController extends Controller {

    constructor(parent) {
        super(parent, false);
        this.event = null;
        this.view = new EventView(parent);
    }

    action = () => {
        EventModel.getEvent().then(
            (event) => {
                this.event = event;
                this.view.render(this.event);
            },
            (error) => {}
        );
    }
}