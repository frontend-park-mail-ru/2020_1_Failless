'use strict';

import View from 'Eventum/core/view.js';
import landingTemplate from 'Components/landing/template.hbs';
import TextConstants from 'Eventum/utils/language/text';

/**
 * @class create LandingView class
 */
export default class LandingView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    destructor() {
    }

    /**
     * Render template
     * @param {boolean} isAuth
     */
    render(isAuth = false) {
        const landing = landingTemplate({
            auth: isAuth,
            MOTTO: TextConstants.LANDING__MOTTO,
            MAIN_DESCRIPTION: TextConstants.LANDING__MAIN_DESCRIPTION,
            AUTHED_MSG: TextConstants.LANDING__AUTHED_MSG,
            SCREEN1_TITLE: TextConstants.LANDING__SCREEN1_TITLE,
            LANDING__SCREEN1_1: TextConstants.LANDING__SCREEN1_1,
            LANDING__SCREEN1_2: TextConstants.LANDING__SCREEN1_2,
            LANDING__SCREEN1_3: TextConstants.LANDING__SCREEN1_3,
            LANDING__SCREEN1_4: TextConstants.LANDING__SCREEN1_4,
            SCREEN2_TITLE: TextConstants.LANDING__SCREEN2_TITLE,
            SHORT_DESCRIPTION: TextConstants.LANDING__SHORT_DESCRIPTION,
            JOIN: TextConstants.BASIC__JOIN,
            REPOS: TextConstants.BASIC__REPOS,
            PREV_WORKS: TextConstants.LANDING__PREV_WORKS,
            MOBILE_APPS: TextConstants.LANDING__MOBILE_APPS,
            RIGHTS: TextConstants.LANDING__RIGHTS,
            REPO: TextConstants.BASIC__REPO,
        });
        this.parent.insertAdjacentHTML('beforeend', landing);
    }
}