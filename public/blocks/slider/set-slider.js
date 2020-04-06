import {MIN_AGE, MAX_AGE, MIN_LIMIT, MAX_LIMIT} from 'Eventum/utils/static-data.js';

const CONST_OFFSET = 1;

// TODO: separate pairs from individual sliders
export default class SliderManager {
    constructor() {
        this.sliders = [];
    }

    setSliders({slider1, initialValue1}, {slider2, initialValue2}) {
        let minSliderIndex = this.#registerSlider(slider1, initialValue1, function(offset, maxOffset) {return offset <= maxOffset;});
        let maxSliderIndex = this.#registerSlider(slider2, initialValue2, function(offset, maxOffset) {return offset >= maxOffset;});

        this.#configureSlider(this.sliders[minSliderIndex], this.#moveSliders, MAX_AGE, MIN_AGE);
        this.#configureSlider(this.sliders[maxSliderIndex], this.#moveSliders, MAX_AGE, MIN_AGE);

        // Set maxOffset
        this.sliders[minSliderIndex].maxOffset = this.#rightOffset();
        this.sliders[maxSliderIndex].maxOffset = this.#leftOffset();
    }

    setSlider(slider, initialValue) {
        this.#configureSlider(
            this.sliders[this.#registerSlider(slider, initialValue, null)],
            this.#moveOne,
            MAX_LIMIT,
            MIN_LIMIT);
    }

    #registerSlider(slider, initialValue, offsetFunc) {
        this.sliders.push({
            thumbLabel: slider.querySelector('.slider__value'),
            maxmin:     slider.querySelector('.slider__maxmin'),
            input:      slider.querySelector('input'),
            step:       null,
            maxWidth:   slider.getBoundingClientRect().width,
            currentValue: initialValue,
            maxOffset:  null,
            checkOffset: offsetFunc,
        });
        return this.sliders.length - 1;
    }

    // TODO: DRY
    #moveSliders = (activeSlider) => {
        let offset = CONST_OFFSET + this.sliders[0].step * (activeSlider.value - MIN_AGE);
        // Detect which slider is active
        if (activeSlider.name === 'slider_min') {
            offset = CONST_OFFSET + this.sliders[0].step * (activeSlider.value - MIN_AGE);

            if (this.sliders[0].checkOffset(offset, this.sliders[0].maxOffset)) {
                this.sliders[0].currentValue = activeSlider.value;
            } else {
                this.sliders[0].currentValue = this.sliders[1].currentValue - 1;
                offset = this.sliders[0].maxOffset;
            }

            this.sliders[0].thumbLabel.setAttribute('slider_value', this.sliders[0].currentValue);
            this.sliders[0].input.value = this.sliders[0].currentValue;
            this.sliders[0].thumbLabel.style.left = offset.toString() + 'px';
            this.sliders[1].maxOffset = this.#leftOffset();
        } else {
            offset = CONST_OFFSET + this.sliders[1].step * (activeSlider.value - MIN_AGE);

            if (this.sliders[1].checkOffset(offset, this.sliders[1].maxOffset)) {
                this.sliders[1].currentValue = activeSlider.value;
            } else {
                this.sliders[1].currentValue = Number(this.sliders[0].currentValue) + 1;
                offset = this.sliders[1].maxOffset;
            }

            this.sliders[1].thumbLabel.setAttribute('slider_value', this.sliders[1].currentValue);
            this.sliders[1].input.value = this.sliders[1].currentValue;
            this.sliders[1].thumbLabel.style.left = offset.toString() + 'px';
            this.sliders[0].maxOffset = this.#rightOffset();
        }
    };

    #rightOffset() {
        return CONST_OFFSET + (this.sliders[1].currentValue - MIN_AGE - 1) * this.sliders[0].step;
    }

    #leftOffset() {
        return CONST_OFFSET + (this.sliders[0].currentValue - MIN_AGE + 1) * this.sliders[1].step;
    }

    #moveOne = (activeSlider) => {
        this.sliders[2].currentValue = activeSlider.value;
        let offset = CONST_OFFSET + this.sliders[2].step * (this.sliders[2].currentValue - MIN_LIMIT);
        this.sliders[2].thumbLabel.setAttribute('slider_value', this.sliders[2].currentValue);
        this.sliders[2].input.value = this.sliders[2].currentValue;
        this.sliders[2].thumbLabel.style.left = offset.toString() + 'px';
    };

    #configureSlider(slider, movementFunc, max, min) {
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