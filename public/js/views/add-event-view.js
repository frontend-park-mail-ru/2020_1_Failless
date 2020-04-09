'use strict';

import View from 'Eventum/core/view.js';
import eventPopupTemplate from 'Components/event-popup/template.hbs';

export default class AddEventView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     * @param {Array} tags
     */
    constructor(parent, tags) {
        super(parent);
        this.parent = parent;
        this.tags = tags;
        this.data = null;
    }
    render() {
        // let k = 1;
        const template = eventPopupTemplate({
            id: 'submit-event',
            fields: [
                {
                    name: 'Заголовок',
                    type: 'text',
                },
                {
                    name: 'Описание',
                    textarea: true,
                    type: 'text',
                },
                {
                    name: 'Тип события',
                    select: true,
                    isTag: true,
                    options: this.tags,
                },
                {
                    name: 'Дата',
                    type: 'date',
                    options: this.tags,
                },
                {
                    name: 'Количество человек',
                    select: true,
                    options: Array(14).fill(undefined, undefined, undefined).map((_, idx) => 2 + idx)
                },
                // {
                //     name: 'Изображение',
                //     file: true,
                // },
            ],
        });
        this.parent.insertAdjacentHTML('beforeend', template);
    }
}