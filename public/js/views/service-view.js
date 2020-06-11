'use strict';

import View from 'Eventum/core/view';
import ServiceTemplate from 'Components/service/template.hbs';

export default class ServiceView extends View {
    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    render() {
        this.parent.innerHTML = ServiceTemplate({
            MESSAGE: 'В данный момент мы в поте лица наводим марафет всему сервису<br>Мы можем сообщить вам, как только всё снова заработает<br>Благодарим Вас за терпение',
            BUTTON: 'Уведомить',
        });
    }
}