'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const controller_js_1 = require("../core/controller.js");
const event_popup_view_1 = require("../views/popup/event-popup-view");
/**
 * Base popup controller
 */
class PopupController extends controller_js_1.default {
    /**
     *
     * @param parent
     */
    constructor(parent) {
        super(parent);
        this.eventPopup = new event_popup_view_1.default(parent);
    }
    action() {
        super.action();
    }
    newEvent() {
        this.eventPopup.render();
        let submit = document.getElementsByClassName('event-form__submit')[0];
        submit.addEventListener('onclick', () => { console.log('submit was pressed'); });
        let upload = document.getElementsByClassName('event-form__upload')[0];
        upload.addEventListener('onclick', () => { });
    }
}
exports.default = PopupController;
//# sourceMappingURL=base-popup-controller.js.map