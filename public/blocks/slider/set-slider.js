export default function SetSliders(minValue, maxValue, initialValue) {
    let sliders = document.querySelectorAll('.slider');

    sliders.forEach((slider) => {
        let thumbLabel = slider.getElementsByClassName('slider__value')[0];
        let maxmin = slider.childNodes[1];
        let maxWidth = slider.getBoundingClientRect().width;    // TODO: this shit refuses to work
        let input = slider.childNodes[3];
        let step = (maxWidth - 25) / (maxValue - minValue); // 25px - width of thumb

        // Set initial values
        maxmin.childNodes[1].innerText = minValue;
        maxmin.childNodes[3].innerText = maxValue;
        input.setAttribute('min', minValue);
        input.setAttribute('max', maxValue);
        updateSlider(initialValue);

        input.addEventListener("input", function(e) {
            e.preventDefault();
            updateSlider(this.value);
        });

        function updateSlider(value) {
            thumbLabel.setAttribute('slider_value', value);
            input.setAttribute('value', value);

            let leftOffset = 1 + step * (value - minValue);
            thumbLabel.style.left = leftOffset.toString() + "px";
        }
    });
}