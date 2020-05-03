import Component from 'Eventum/core/component';
import EventEditTemplate from 'Blocks/event-edit/template.hbs';
import tagTemplate from 'Blocks/tag/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import {icons} from 'Eventum/utils/static-data';

export default class EventEdit extends Component {
    /**
     * Node itself
     * @type {HTMLElement}
     */
    node = null;
    template = null;

    /**
     *
     * @type {HTMLElement}
     */
    tagsArea = null;

    /**
     * Create Button component
     * @param {HTMLElement} node
     */
    constructor(node) {
        super();
        this.element = node;
        this.template = EventEditTemplate;
    }

    get element() {
        return this.node;
    }

    set element(node) {
        this.node = node;
        this.tagsArea = node.querySelector('.event-edit__tags');
    }

    show() {
        this.node.classList.add('event-edit_active');
    }

    hide() {
        this.node.classList.remove('event-edit_active');
    }

    /**
     * Render tags in form
     * @param {Array<{HTMLElement}>} tags
     */
    addTags(tags) {
        makeEmpty(this.tagsArea);
        if (!tags || tags.length === 0) {
            this.tagsArea.insertAdjacentHTML('afterbegin', icons.get('plus'));
        } else {
            tags.forEach((tag) => {
                this.tagsArea.insertAdjacentHTML('beforeend', tagTemplate({...tag}));
            });
        }
    }
}