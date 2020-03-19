let btn = document.getElementsByClassName('btn btn__success')[0];
btn.addEventListener('onmouse', (event) => {
    console.log('mouse moved');
    console.log(event);
});
