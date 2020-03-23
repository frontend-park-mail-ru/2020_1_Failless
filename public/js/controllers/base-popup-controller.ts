'use strict';

import Controller from '../core/controller.js'
import EventPopupView from '../views/popup/event-popup-view';

/**
 * Base popup controller
 */
export default class PopupController extends Controller {
    eventPopup: EventPopupView;

    /**
     *
     * @param parent
     */
    constructor(parent: HTMLElement) {
        super(parent);
        this.eventPopup = new EventPopupView(parent);
    }

    action() {
        super.action();
    }

    newEvent() {
        this.eventPopup.render();
        let submit = document.getElementsByClassName('event-form__submit')[0];
        submit.addEventListener('onclick', (event)=>{ console.log('submit was pressed'); });
        let upload = document.getElementsByClassName('event-form__upload')[0];
        upload.addEventListener('onclick', (event) => { /* TODO: upload image to browser */ });
    }

}
