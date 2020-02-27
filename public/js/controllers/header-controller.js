'use strict';

import Controller from '../core/controller.js';
import HeaderView from '../views/header-view.js';

/**
 * @class EventController
 */
export default class HeaderController extends Controller {

    /**
     * Construct obj
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent, false);
        this.view = new HeaderView(parent);
        this.events = [];
    }

    // TODO Нахуй Bind, стрелочные функции топ, какое же говно с getElementsByClassName - переписать
    /**
     * Create action
     */
    action(routerInstance) {
        if (document.getElementsByClassName('header').length !== 0) {
            document.getElementsByClassName('header')[0].remove();
        }
        this.view.render();

        const sweetHomePage = document.getElementsByClassName('image icon_btn icon__size_m header__item')[0];
        sweetHomePage.addEventListener('click', this._homeRedirect.bind(this));

        const eventSearch = document.getElementsByClassName('header__item')[1];
        eventSearch.addEventListener('click', this._eventSearchRedirect.bind(this));

        const userSignUp = document.getElementsByClassName('header__item')[2];
        userSignUp.addEventListener('click', this._signUpRedirect.bind(this));

        const userLogin = document.getElementsByClassName('header__item')[3];
        userLogin.addEventListener('click', this._loginRedirect.bind(this));

        const userProfile = document.getElementsByClassName('header__item')[4];
        userProfile.addEventListener('click', this._profileRedirect.bind(this));

        this.events.push(
            {item: sweetHomePage, type: 'click', handler: this._homeRedirect.bind(this), router: routerInstance},
            {item: eventSearch, type: 'click', handler: this._eventSearchRedirect.bind(this), router: routerInstance},
            {item: userSignUp, type: 'click', handler: this._signUpRedirect.bind(this), router: routerInstance},
            {item: userLogin, type: 'click', handler: this._loginRedirect.bind(this), router: routerInstance},
            {item: userProfile, type: 'click', handler: this._profileRedirect.bind(this), router: routerInstance},
        );
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on home event
     * @param {event} event
     */
    _homeRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/');
        this.events[0].router.route();
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on event search event
     * @param {event} event
     */
    _eventSearchRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/event');
        this.events[1].router.route();
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on sign up event
     * @param {event} event
     */
    _signUpRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/signup');
        this.events[2].router.route();
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on login event
     * @param {event} event
     */
    _loginRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/login');
        this.events[3].router.route();
    }

    // [HIGH-PRIORITY] TODO Вся функция - костыли и говно
    /**
     * Handle click on home event
     * @param {event} event
     */
    _profileRedirect(event) {
        event.preventDefault();
        
        window.history.pushState({}, '', '/profile');
        this.events[4].router.route();
    }
}