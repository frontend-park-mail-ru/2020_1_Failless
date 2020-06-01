'use strict';

import View from 'Eventum/core/view';
import landingTemplate from 'Components/landing/template.hbs';
import TextConstants from 'Eventum/utils/language/text';
import settings from 'Settings/config';

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
            SECTION1_TITLE: TextConstants.LANDING__SECTION1_TITLE,
            SECTION1_1: TextConstants.LANDING__SECTION1_1,
            SECTION1_2: TextConstants.LANDING__SECTION1_2,
            SECTION1_3: TextConstants.LANDING__SECTION1_3,
            SECTION1_4: TextConstants.LANDING__SECTION1_4,
            SECTION2_TITLE: TextConstants.LANDING__SECTION2_TITLE,
            SECTION2_1: TextConstants.LANDING__SECTION2_1,
            SECTION2_2: TextConstants.LANDING__SECTION2_2,
            SECTION2_3: TextConstants.LANDING__SECTION2_3,
            mid_event_photo: `${settings.aws}/app/MidEvent.webp`,
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