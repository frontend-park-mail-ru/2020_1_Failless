'use strict';

import Controller from 'Eventum/core/controller.js';
import LandingView from 'Eventum/views/landing-view.js';
import router from 'Eventum/core/router.js';

/**
 * @class LandingController
 */
export default class LandingController extends Controller {

    /**
     * construct object of LandingController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new LandingView(parent);
        this.slideIndex = 1;
        this.timer = {};
    }

    /**
     * Create action
     */
    action() {
        super.action();
        this.view.render();

        this.showSlides(this.slideIndex);

        document.querySelectorAll('.re_btn__white').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                router.redirectForward('/signup');
            });
        });

        document.querySelectorAll('.landing__dot').forEach((dot) => {
            dot.addEventListener('click', this.currentSlide);
        });

        document.getElementsByClassName('landing__prev')[0].addEventListener('click', this.plusSlides);
        document.getElementsByClassName('landing__next')[0].addEventListener('click', this.plusSlides);

        this.addEventHandler(window, 'scroll', this.stickyHeader);
    }


    // Next/previous controls
    plusSlides = (event) => {
        if (event.target === document.getElementsByClassName('landing__next')[0]) {
            this.showSlides(this.slideIndex += 1);
        }
        if (event.target === document.getElementsByClassName('landing__prev')[0]) {
            this.showSlides(this.slideIndex -= 1);
        }
    }

    // Thumbnail image controls
    currentSlide = (event) => {
        document.querySelectorAll('.landing__dot').forEach((dot, index) => {
            if (event.target === dot) this.showSlides(this.slideIndex = index + 1);
        });
    }

    showSlides = (n) => {
        let i;
        let slides = document.getElementsByClassName('landing__mySlides');
        let dots = document.getElementsByClassName('landing__dot');

        if (n) {
            clearTimeout(this.timer);
            this.timer = {};
            if (n > slides.length) {this.slideIndex = 1}
            if (n < 1) {this.slideIndex = slides.length}
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = 'none';
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(' active', '');
            }
            slides[this.slideIndex-1].style.display = 'block';
            dots[this.slideIndex-1].className += ' active';
            this.timer = setTimeout(this.showSlides, 5000); // Change image every 2 seconds
        } else {
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = 'none';
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(' active', '');
            }
            this.slideIndex++;
            if (this.slideIndex > slides.length) {this.slideIndex = 1}
            slides[this.slideIndex-1].style.display = 'block';
            dots[this.slideIndex-1].className += ' active';
            this.timer = setTimeout(this.showSlides, 5000); // Change image every 2 seconds
        }
    }
}