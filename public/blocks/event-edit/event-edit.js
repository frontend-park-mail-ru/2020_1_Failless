import Component from 'Eventum/core/component';
import EventEditTemplate from 'Blocks/event-edit/template.hbs';
import tagTemplate from 'Blocks/tag/template.hbs';
import darkOverlayTemplate from 'Blocks/dark-overlay/template.hbs';
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
     * @type {Object<HTMLElement>}
     */
    vDOM = Object;

    fields = ['photos', 'title', 'about', 'tags', 'time', 'slider'];

    /**
     * Create Button component
     * @param {HTMLElement} node
     */
    constructor(node) {
        super();
        this.element = node;
        this.template = EventEditTemplate;
        this.setInitialMargins();
        window.addEventListener('resize', this.setInitialMargins.bind(this));
    }

    get element() {
        return this.node;
    }

    set element(node) {
        this.node = node;
        this.#setvDOM();
    }

    setInitialMargins() {
        this.element.style.marginTop = '-' + this.element.offsetHeight.toString() + 'px';
        this.element.style.marginRight = '-' + this.element.offsetWidth.toString() + 'px';
    }

    /**
     * Thanks to BEM it's so easy
     */
    #setvDOM() {
        this.fields.forEach((field) => {
            this.vDOM[field] = this.element.querySelector(`.event-edit__${field}`)
        });
    }

    // /**
    //  * TODO: check this one
    //  */
    // checkvDOM() {
    //     console.log(this.vDOM);
    //     setTimeout(() => {
    //         this.fields.forEach((field) => {
    //             if (!this.vDOM[field]) {
    //                 return false;
    //             }
    //         });
    //     }, 5000)
    // }

    show() {
        this.element.classList.add('event-edit_active');
    }

    hide() {
        this.element.classList.remove('event-edit_active');
    }

    /**
     * Render tags in form
     * @param {Array<{HTMLElement}>} tags
     */
    addTags(tags) {
        const tagsDiv = this.tagsDiv;
        makeEmpty(tagsDiv);
        if (!tags || tags.length === 0) {
            tagsDiv.insertAdjacentHTML('afterbegin', icons.get('plus'));
        } else {
            tags.forEach((tag) => {
                tagsDiv.insertAdjacentHTML('beforeend', tagTemplate({...tag}));
            });
        }
    }

    /**
     * Get all data from the form
     * @return {{
     *     photos: Array<{string}>,
     *     title: string,
     *     about: string,
     *     tags: Array<{Number}>,
     *     time: string?,
     *     limit: Number,
     * }}
     */
    retrieveData() {
        let data = {};

        data.photos = this.vDOM['photos'];
        data.title = this.vDOM['title'].value;
        data.about = this.vDOM['about'].value;
        data.tags = [];
        this.tagsDiv.querySelectorAll('.tag__container').forEach((tag) => {
            data.tags.push(+tag.firstElementChild.getAttribute('data-id'));
        });
        data.time = this.vDOM['time'].value;
        data.limit = +this.vDOM['slider'].querySelector('select').value;

        console.log(data);
        data.photos = null;

        return data;
    }

    /**
     * Check if the form isn't empty
     * @param data {{
     *     photos: Array<{string}>,
     *     title: string,
     *     about: string|null,
     *     tags: Array<{Number}>|null,
     *     time: string|null,
     *     limit: Number,
     * }}
     */
    validateData(data) {
        return data.title !== '';
    }

    cleanData() {
        let photosDiv = this.photosDiv;
        makeEmpty(photosDiv);
        photosDiv.insertAdjacentHTML('afterbegin', darkOverlayTemplate({text: 'Добавить'}));
        photosDiv.insertAdjacentHTML('beforeend', icons.get('event-default'));
        this.vDOM['title'].value = '';
        this.vDOM['about'].value = '';
        this.addTags(null);
        this.vDOM['time'].value = '';
    }

    /***********************************************
                 Additional get functions
     ***********************************************/
    get photosDiv() {
        // while (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }

        return this.vDOM['photos'];
    }

    get titleTextArea() {
        // while (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }
        return this.vDOM['title'];
    }

    get aboutTextArea() {
        // while (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }
        return this.vDOM['about'];
    }

    get tagsDiv() {
        // if (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }
        return this.vDOM['tags'];
    }

    get timeInput() {
        // if (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }
        return this.vDOM['time'];
    }

    get sliderDiv() {
        // if (!this.checkvDOM()) {
        //     this.#setvDOM();
        // }
        return this.vDOM['slider'];
    }
}