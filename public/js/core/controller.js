'use strict';

/**
 * Basic controller class
 */
export default class Controller {

    /**
     *
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        this.parent = parent;
    }

    destructor() {
        this.parent.innerHTML = '';
    }

    action() {
    }
}
