'use strict';

import Component from 'Eventum/core/component';
import FiltersTemplate from 'Blocks/filters/template.hbs';
import SliderManager from 'Blocks/slider/set-slider';

export default class Filters extends Component {
    constructor(data) {
        super(data);
        this.cssClass = 'filters';
        this.template = FiltersTemplate;
        this.data = data;
        this.fields = ['tags', 'keywords', 'men-checkbox', 'women-checkbox'];
        this.doubleSliderManager = null;
    }

    didRender() {
        super.didRender();
        this.tags = Array.prototype.slice.call(this.tagsDiv.querySelectorAll('.tag__container'));
        this.initSliders();
    }

    async initSliders() {
        // Set two sliders and connect each other
        this.doubleSliderManager = new SliderManager();
        let sliders = this.element.querySelectorAll('.slider');
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

    get sliderAge() {
        return this.vDOM['slider-age'];
    }
}