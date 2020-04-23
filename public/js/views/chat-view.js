'use strict';

import MyView from 'Eventum/views/my-view.js';

/**
 * @class create ChatView class
 */
export default class ChatView extends MyView {
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    render() {
        super.render();
    }

    async showCenterError(error) {
        this.getDOMElements();
        await this.showServerError(this.mainArea, error);
    }
}