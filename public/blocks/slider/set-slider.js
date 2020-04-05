import {MIN_AGE, MAX_AGE} from '../../js/utils/static-data.js';

const CONST_OFFSET = 1;

export default class SliderManager {
    constructor() {
        this.sliders = [];
    }

    setSliders({slider1, initialValue1}, {slider2, initialValue2}) {
        this._registerSlider(slider1, initialValue1, function(offset, maxOffset) {return offset <= maxOffset;});
        this._registerSlider(slider2, initialValue2, function(offset, maxOffset) {return offset >= maxOffset;});

        this.sliders.forEach((slider) => {
            // Set step
            slider.step = (slider.maxWidth - 25) / (MAX_AGE - MIN_AGE);

            // Render max and min values if there are ones
            if (slider.maxmin) {
                slider.maxmin.firstElementChild.innerText = MIN_AGE;
                slider.maxmin.lastElementChild.innerText = MAX_AGE;
            } else {
                slider.thumbLabel.style.top = '3px';
            }

            // Set input
            slider.input.setAttribute('min', MIN_AGE);
            slider.input.setAttribute('max', MAX_AGE);

            // Place slider
            slider.thumbLabel.setAttribute('slider_value', slider.currentValue);
            slider.input.setAttribute('value', slider.currentValue);
            let leftOffset = CONST_OFFSET + slider.step * (slider.currentValue - MIN_AGE);
            slider.thumbLabel.style.left = leftOffset.toString() + 'px';

            // Add event listener (same for two so it may cause problems on touchscreens)
            slider.input.addEventListener('input', (e) => {
                e.preventDefault();
                this._moveSliders(e.target);
            });
        });

        // Set maxOffset
        this.sliders[0].maxOffset = this._rightOffset();
        this.sliders[1].maxOffset = this._leftOffset();
    }

    _registerSlider(slider1, initialValue1, offsetFunc) {
        this.sliders.push({
            thumbLabel: slider1.querySelector('.slider__value'),
            maxmin:     slider1.querySelector('.slider__maxmin'),
            input:      slider1.querySelector('input'),
            step:       null,
            maxWidth:   slider1.getBoundingClientRect().width,
            currentValue: initialValue1,
            maxOffset:  null,
            checkOffset: offsetFunc,
        });
    }

    // TODO: DRY
    _moveSliders(activeSlider) {
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
            this.sliders[1].maxOffset = this._leftOffset();
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
            this.sliders[0].maxOffset = this._rightOffset();
        }
    }

    _rightOffset() {
        return CONST_OFFSET + (this.sliders[1].currentValue - MIN_AGE - 1) * this.sliders[0].step;
    }

    _leftOffset() {
        return CONST_OFFSET + (this.sliders[0].currentValue - MIN_AGE + 1) * this.sliders[1].step;
    }

    // setSlider(slider, initialValue) {
    //
    // }
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