'use strict';

import Component from 'Eventum/core/component';
import EventEditTemplate from 'Blocks/event-edit/template.hbs';
import tagTemplate from 'Blocks/tag/template.hbs';
import imageEditTemplate from 'Blocks/image-edit/template.hbs';
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

    fields = ['photos', 'title', 'about', 'tags', 'time', 'slider', 'photo-helper'];

    /**
     * Create Button component
     * @param {HTMLElement} node
     */
    constructor(node) {
        super();
        this.images = null;
        this.element = node;
        this.template = EventEditTemplate;
        this.#setMinValueForDateTimeInput();
        this.#setInitialMargins();
        window.addEventListener('resize', this.#setInitialMargins.bind(this));
    }

    get element() {
        return this.node;
    }

    set element(node) {
        this.node = node;
        this.#setvDOM();
    }

    /**
     * Set min value for datetime input
     * in format 2017-06-01T08:30
     */
    #setMinValueForDateTimeInput() {
        this.timeInput.min = new Date().toUTCString();
    }

    #setInitialMargins() {
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

    show() {
        this.element.classList.add('event-edit_active');
    }

    hide() {
        this.#cleanData();
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

        data.photos = this.images;
        data.title = this.vDOM['title'].value;
        data.about = this.vDOM['about'].value;
        data.tags = [];
        this.tagsDiv.querySelectorAll('.tag__container').forEach((tag) => {
            data.tags.push(+tag.firstElementChild.getAttribute('data-id'));
        });
        data.time = this.vDOM['time'].value;
        data.limit = +this.vDOM['slider'].querySelector('select').value;

        console.log(data);
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

    /**
     * Remove all data from the form
     */
    #cleanData() {
        let oldImages = this.photosDiv.querySelectorAll('.image-edit');
        if (oldImages && oldImages.length !== 0) {
            oldImages.forEach(oldImage => oldImage.remove());
            this.photoHelperDiv.style.display = 'flex';
        }
        this.vDOM['title'].value = '';
        this.vDOM['about'].value = '';
        this.addTags(null);
        this.vDOM['time'].value = '';
    }

    /***********************************************
                    Image upload part
     ***********************************************/

    /**
     * Render uploaded images with remove button
     * TODO: check for .png, .jpeg, .jpg
     */
    previewImages() {
        // Get the files
        const files = this.photosDiv.querySelector('input').files;

        if (!files || files.length === 0) {
            console.log('here');
            console.log(files);
            return;
        }

        // Hide photo helper
        this.photoHelperDiv.style.display = 'none';

        // Render first image with width = 100%
        // Get height of the parent element
        // Set all next images with this height and width: auto;
        let height = 0;
        const initReader = new FileReader();
        initReader.addEventListener('load', (event) => {
            this.images = event.target.result.split(';')[1].split(',')[1];
            console.log(this.images)
            this.photosDiv.insertAdjacentHTML('beforeend', imageEditTemplate({src: event.target.result}));
            const firstImage = this.photosDiv.querySelector('img');
            firstImage.onload = () => {
                height = this.photosDiv.offsetHeight - 5;
                firstImage.style.cssText = `height: ${height}px; width: auto;`;
                for (let iii = 1; iii < files.length; iii++) {
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        this.photosDiv.insertAdjacentHTML('beforeend', imageEditTemplate({src: event.target.result, style: `height: ${height}px; width: auto;`}));
                    });
                    reader.readAsDataURL(files[iii]);
                }
            };
        });
        initReader.readAsDataURL(files[0]);
    }

    removePreviewImage(eventTarget) {
        eventTarget.closest('.image-edit').remove();
        if (this.photosDiv.childElementCount === 1) {
            this.photoHelperDiv.style.display = 'flex';
        }
    }

    /***********************************************
                 Additional get functions
     ***********************************************/
    get photosDiv() {
        return this.vDOM['photos'];
    }

    get photoHelperDiv() {
        return this.vDOM['photo-helper'];
    }

    get titleTextArea() {
        return this.vDOM['title'];
    }

    get aboutTextArea() {
        return this.vDOM['about'];
    }

    get tagsDiv() {
        return this.vDOM['tags'];
    }

    get timeInput() {
        return this.vDOM['time'];
    }

    get sliderDiv() {
        return this.vDOM['slider'];
    }
}