'use strict';

import Component from 'Eventum/core/component';
import FiltersTemplate from 'Blocks/filters/template.hbs';
import SliderManager from 'Blocks/slider/set-slider';
import TextConstants from 'Eventum/utils/language/text';

export default class Filters extends Component {
    /**
     * @param data {{
     *     tags: boolean | Object,
     *     keywords: boolean,
     *     gender: boolean,
     *     age: boolean,
     *     user_limit: boolean,
     * }}
     */
    constructor(data) {
        super(data);
        this.cssClass = 'filters';
        this.template = FiltersTemplate;
        this.data = Object.assign({}, data, {
            TAGS_HEADER: TextConstants.FILTERS__TAGS_HEADER,
            KEYWORDS_HEADER: TextConstants.FILTERS__KEYWORDS_HEADER,
            KEYWORDS_PLACEHOLDER: TextConstants.FILTERS__KEYWORDS_PLACEHOLDER,
            GENDER: TextConstants.BASIC__GENDER,
            MEN: TextConstants.BASIC__MEN,
            WOMEN: TextConstants.BASIC__WOMEN,
            AGE: TextConstants.BASIC__AGE,
            FROM: TextConstants.BASIC__FROM,
            TO: TextConstants.BASIC__TO,
            LOCATION: TextConstants.BASIC__LOCATION,
            FIND: TextConstants.BASIC__FIND,
            MEMBER_AMOUNT: TextConstants.FILTERS__MEMBER_AMOUNT,
        });
        this.fields = ['tags', 'keywords', 'men-checkbox', 'women-checkbox', 'slider-min', 'slider-max', 'slider-limit'];
    }

    didRender() {
        super.didRender();
        this.tags = Array.prototype.slice.call(this.tagsDiv.querySelectorAll('.tag__container'));
        if (this.data.age) {
            this.initSliders();
        }
        if (this.data.user_limit) {
            this.initSlider();
        }
    }

    getFilters() {
        let options = {};

        if (this.data.tags) {
            options.tags = [];
            // Get active tags
            let activeTags = this.tagsDiv.querySelectorAll('.tag__container.tag__container_active');
            if (activeTags) {
                activeTags.forEach((tag) => {
                    options.tags.push(+tag.firstElementChild.getAttribute('data-id'));
                });
            }
        }

        if (this.data.keywords) {
            options.keyWords = this.keywordsInput.value.split(' ');
        }

        if (this.data.gender) {
            options.men = this.menCheckbox.checked;
            options.women = this.womenCheckbox.checked;
        }

        if (this.data.age) {
            options.minAge = Number(this.minSlider.getAttribute('slider_value'));
            options.maxAge = Number(this.maxSlider.getAttribute('slider_value'));
        }

        if (this.data.user_limit) {
            let limit = this.limitSlider.getAttribute('slider_value');
            if (limit !== '?') {
                options.user_limit = Number(limit);
            }
        }

        return options;
    }

    async initSlider() {
        // Set two sliders and connect each other
        this.singleSliderManager = new SliderManager();
        this.singleSliderManager.setSlider(
            this.element.querySelector('.filters__section_user-limit').querySelector('.slider'), 10);
    }

    // TODO: warning, depends on sliders order!!!
    async initSliders() {
        // Set two sliders and connect each other
        this.doubleSliderManager = new SliderManager();
        let sliders = this.element.querySelector('.filters__section_age').querySelectorAll('.slider');
        this.doubleSliderManager.setSliders(
            {slider1: sliders[0], initialValue1: 18},
            {slider2: sliders[1], initialValue2: 25});
    }

    /***********************************************
                 Additional get functions
     ***********************************************/

    get tagsDiv() {
        return this.vDOM['tags'];
    }

    get keywordsInput() {
        return this.vDOM['keywords'];
    }

    get menCheckbox() {
        return this.vDOM['men-checkbox'];
    }

    get womenCheckbox() {
        return this.vDOM['women-checkbox'];
    }

    get minSlider() {
        return this.vDOM['slider-min'];
    }

    get maxSlider() {
        return this.vDOM['slider-max'];
    }

    get limitSlider() {
        return this.vDOM['slider-limit'];
    }
}