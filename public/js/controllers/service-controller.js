'use strict';

import Controller from 'Eventum/core/controller';
import ServiceView from 'Eventum/views/service-view';

export default class ServiceController extends Controller {
    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new ServiceView(parent);
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    action() {
        super.action();
        this.view.render();
        this.addEventHandler(document.body, 'click', this.view.inputHandler.bind(this.view));
    }
}