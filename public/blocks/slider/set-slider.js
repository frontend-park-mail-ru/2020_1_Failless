import {MIN_AGE, MAX_AGE, MIN_LIMIT, MAX_LIMIT} from 'Eventum/utils/static-data.js';

const CONST_OFFSET = 1;

// TODO: separate pairs from individual sliders
export default class SliderManager {
    constructor() {
        this.sliders = [];
        this.lonelySliders = [];
        this.type = 'age';
        this.min = MIN_AGE;
    }

    setSliders({slider1, initialValue1}, {slider2, initialValue2}, type) {
        let minSliderIndex = this.#registerSlider(slider1, initialValue1, function(offset, maxOffset) {return offset <= maxOffset;}, true);
        let maxSliderIndex = this.#registerSlider(slider2, initialValue2, function(offset, maxOffset) {return offset >= maxOffset;}, true);

        if (type === 'age') {
            this.min = MIN_AGE;
            this.#configureSlider(this.sliders[minSliderIndex], this.#moveSliders, MIN_AGE, MAX_AGE);
            this.#configureSlider(this.sliders[maxSliderIndex], this.#moveSliders, MIN_AGE, MAX_AGE);
        } else {
            this.min = MIN_LIMIT;
            this.#configureSlider(this.sliders[minSliderIndex], this.#moveSliders, MIN_LIMIT, MAX_LIMIT);
            this.#configureSlider(this.sliders[maxSliderIndex], this.#moveSliders, MIN_LIMIT, MAX_LIMIT);
        }

        this.type = type;

        // Set maxOffset
        this.sliders[minSliderIndex].maxOffset = this.#rightOffset();
        this.sliders[maxSliderIndex].maxOffset = this.#leftOffset();
    }

    setSlider(slider, initialValue) {
        this.#configureSlider(
            this.lonelySliders[this.#registerSlider(slider, initialValue, null, false)],
            this.#moveOne,
            MAX_LIMIT + 1,  // TODO: remember that
            MIN_LIMIT);
    }

    #registerSlider(slider, initialValue, offsetFunc, pair) {
        let array = pair ? this.sliders : this.lonelySliders;
        array.push({
            thumbLabel: slider.querySelector('.slider__value'),
            maxmin:     slider.querySelector('.slider__maxmin'),
            input:      slider.querySelector('input'),
            step:       null,
            maxWidth:   slider.getBoundingClientRect().width,
            currentValue: initialValue,
            maxOffset:  null,
            checkOffset: offsetFunc,
        });
        return array.length - 1;
    }

    // TODO: DRY
    #moveSliders = (activeSlider) => {
        let offset = CONST_OFFSET + this.sliders[0].step * (activeSlider.value - this.min);
        // Detect which slider is active
        if (activeSlider.name === 'slider_min') {
            offset = CONST_OFFSET + this.sliders[0].step * (activeSlider.value - this.min);

            if (this.sliders[0].checkOffset(offset, this.sliders[0].maxOffset)) {
                this.sliders[0].currentValue = activeSlider.value;
            } else {
                this.sliders[0].currentValue = this.sliders[1].currentValue;
                offset = this.sliders[0].maxOffset;
            }

            this.sliders[0].thumbLabel.setAttribute('slider_value', this.sliders[0].currentValue);
            this.sliders[0].input.value = this.sliders[0].currentValue;
            this.sliders[0].thumbLabel.style.left = offset.toString() + 'px';
            this.sliders[1].maxOffset = this.#leftOffset();
        } else {
            offset = CONST_OFFSET + this.sliders[1].step * (activeSlider.value - this.min);

            if (this.sliders[1].checkOffset(offset, this.sliders[1].maxOffset)) {
                this.sliders[1].currentValue = activeSlider.value;
            } else {
                this.sliders[1].currentValue = Number(this.sliders[0].currentValue);
                offset = this.sliders[1].maxOffset;
            }

            this.sliders[1].thumbLabel.setAttribute('slider_value', this.sliders[1].currentValue);
            this.sliders[1].input.value = this.sliders[1].currentValue;
            this.sliders[1].thumbLabel.style.left = offset.toString() + 'px';
            this.sliders[0].maxOffset = this.#rightOffset();
        }
    };

    #rightOffset() {
        return CONST_OFFSET + (this.sliders[1].currentValue - this.min) * this.sliders[0].step;
    }

    #leftOffset() {
        return CONST_OFFSET + (this.sliders[0].currentValue - this.min) * this.sliders[1].step;
    }

    #moveOne = (activeSlider) => {
        this.lonelySliders[0].currentValue = activeSlider.value;
        let offset = CONST_OFFSET + this.lonelySliders[0].step * (this.lonelySliders[0].currentValue - MIN_LIMIT);
        if (+activeSlider.value === MAX_LIMIT + 1) {
            this.lonelySliders[0].thumbLabel.setAttribute('slider_value', '?');
        } else {
            this.lonelySliders[0].thumbLabel.setAttribute('slider_value', this.lonelySliders[0].currentValue);
        }
        this.lonelySliders[0].input.value = this.lonelySliders[0].currentValue;
        this.lonelySliders[0].thumbLabel.style.left = offset.toString() + 'px';
    };

    #configureSlider(slider, movementFunc, min, max) {
        // Set step
        slider.step = (slider.maxWidth - 25) / (max - min);

        // Render max and min values if there are ones
        if (slider.maxmin) {
            slider.maxmin.firstElementChild.innerText = min;
            slider.maxmin.lastElementChild.innerText = max;
        } else {
            slider.thumbLabel.style.top = '3px';
        }

        // Set input
        slider.input.setAttribute('min', min);
        slider.input.setAttribute('max', max);

        // Place slider
        slider.thumbLabel.setAttribute('slider_value', slider.currentValue);
        slider.input.setAttribute('value', slider.currentValue);
        let leftOffset = CONST_OFFSET + slider.step * (slider.currentValue - min);
        slider.thumbLabel.style.left = leftOffset.toString() + 'px';

        // Add event listener (same for two so it may cause problems on touchscreens)
        slider.input.addEventListener('input', (e) => {
            e.preventDefault();
            movementFunc(e.target);
        });
    }
}

/* Example ( slider__maxmin is optional )
<div class="slider">
    <div class="slider__maxmin">
        <div>18</div>
        <div>59</div>
    </div>
    <input type="range" min="18" max="100" value="18" step="1">
    <span class="slider__value" slider_value="18"></span>
</div>
* */