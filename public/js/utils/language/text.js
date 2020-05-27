'use strict';

import Library from 'Eventum/utils/language/libraries/Interface';

let localLibrary = Library;

export default class TextConstants {
    static LANGUAGES = {
        RUSSIAN: 'ru',
        ENGLISH: 'en',
    };
    static currentLanguage = TextConstants.LANGUAGES.ENGLISH;

    /**
     *
     * @param lang {'ru' | 'en'}
     * @return {Promise<void>}
     */
    static async translateTo(lang) {
        if (TextConstants.currentLanguage === lang) {
            return;
        }
        if (!localStorage.getItem(`lib_${lang}`)) {
            await this.loadLib(lang);
        } else {
            let newLib = null;
            try {
                newLib = JSON.parse(localStorage.getItem(`lib_${lang}`));
            }
            catch (e) {
                newLib = null;
                console.error(e);
            }
            if (!newLib) {
                await this.loadLib(`lib_${lang}`);
            } else {
                localLibrary = newLib;
                TextConstants.currentLanguage = lang;
            }
        }
    }

    /**
     * Downloads library, sets it as current + loads into localStorage
     * @param lang {'ru' | 'en'}
     */
    static loadLib(lang) {
        return fetch(`/lang/${lang}.json`, {method: 'GET'})
            .then(r => r.json())
            .then(newLib => {
                localLibrary = newLib;
                localStorage.setItem(`lib_${lang}`, JSON.stringify(newLib));
                TextConstants.currentLanguage = lang;
            })
            .catch(console.error);
    }

    static get BASIC__ADD() {return localLibrary.Basic.ADD;}
    static get BASIC__AGE() {return localLibrary.Basic.AGE;}
    static get BASIC__CHANGE() {return localLibrary.Basic.CHANGE;}
    static get BASIC__CHATS() {return localLibrary.Basic.CHATS;}
    static get BASIC__EVENTS() {return localLibrary.Basic.EVENTS;}
    static get BASIC__FIND() {return localLibrary.Basic.FIND;}
    static get BASIC__FROM() {return localLibrary.Basic.FROM;}
    static get BASIC__GENDER() {return localLibrary.Basic.GENDER;}
    static get BASIC__JOIN() {return localLibrary.Basic.JOIN;}
    static get BASIC__LOADING() {return localLibrary.Basic.LOADING;}
    static get BASIC__LOCATION() {return localLibrary.Basic.LOCATION;}
    static get BASIC__MEN() {return localLibrary.Basic.MEN;}
    static get BASIC__NEW_MESSAGE() {return localLibrary.Basic.NEW_MESSAGE;}
    static get BASIC__NO_PHOTOS() {return localLibrary.Basic.NO_PHOTOS;}
    static get BASIC__PHOTOS() {return localLibrary.Basic.PHOTOS;}
    static get BASIC__REPO() {return localLibrary.Basic.REPO;}
    static get BASIC__REPOS() {return localLibrary.Basic.REPOS;}
    static get BASIC__SAVE() {return localLibrary.Basic.SAVE;}
    static get BASIC__SEND() {return localLibrary.Basic.SEND;}
    static get BASIC__SOCIAL_NETWORKS() {return localLibrary.Basic.SOCIAL_NETWORKS;}
    static get BASIC__TO() {return localLibrary.Basic.TO;}
    static get BASIC__VISIT() {return localLibrary.Basic.VISIT;}
    static get BASIC__WOMEN() {return localLibrary.Basic.WOMEN;}
    static get BASIC__YOU() {return localLibrary.Basic.YOU;}
    static get BASIC__YOU_GO() {return localLibrary.Basic.YOU_GO;}

    static get EVENT__LEAVE() {return localLibrary.Event.LEAVE;}
    static get EVENT__VISITED() {return localLibrary.Event.VISITED;}
    static get EVENT__UNVISITED() {return localLibrary.Event.UNVISITED;}

    static get FILTERS__KEYWORDS_HEADER() {return localLibrary.Filters.KEYWORDS_HEADER;}
    static get FILTERS__KEYWORDS_PLACEHOLDER() {return localLibrary.Filters.KEYWORDS_PLACEHOLDER;}
    static get FILTERS__MEMBER_AMOUNT() {return localLibrary.Filters.MEMBER_AMOUNT;}
    static get FILTERS__TAGS_HEADER() {return localLibrary.Filters.TAGS_HEADER;}

    static get FEED__DISLIKE() {return localLibrary.Feed.DISLIKE;}
    static get FEED__LIKE() {return localLibrary.Feed.LIKE;}
    static get FEED__NEW_MATCH() {return localLibrary.Feed.NEW_MATCH;}
    static get FEED__PERSONAL_EVENTS_HEADER() {return localLibrary.Feed.PERSONAL_EVENTS_HEADER;}
    static get FEED__SKIP() {return localLibrary.Feed.SKIP;}
    static get FEED__SUBSCRIPTIONS_HEADER() {return localLibrary.Feed.SUBSCRIPTIONS_HEADER;}

    static get PROFILE__ABOUT_PLACEHOLDER() {return localLibrary.Profile.ABOUT_PLACEHOLDER;}
    static get PROFILE__NO_TAGS() {return localLibrary.Profile.NO_TAGS;}
    static get PROFILE__SUCCESSFUL_SAVE() {return localLibrary.Profile.SUCCESSFUL_SAVE;}
    static get PROFILE__TITLE() {return localLibrary.Profile.TITLE;}
    static get PROFILE__YOU_VISIT() {return localLibrary.Profile.YOU_VISIT;}
    static get PROFILE__YOUR_EVENTS() {return localLibrary.Profile.YOUR_EVENTS;}
    static get PROFILE__YOUR_PHOTOS() {return localLibrary.Profile.YOUR_PHOTOS;}
    static get PROFILE__YOUR_TAGS() {return localLibrary.Profile.YOUR_TAGS;}

    static get AUTH__SUCCESSFUL_SIGNUP() {return localLibrary.Auth.SUCCESSFUL_SIGNUP;}

    static get CHAT__ATTENTION_MESSAGE() {return localLibrary.Chat.ATTENTION_MESSAGE;}
    static get CHAT__LEFT_CHAT() {return localLibrary.Chat.LEFT_CHAT;}
    static get CHAT__MESSAGE_PLACEHOLDER() {return localLibrary.Chat.MESSAGE_PLACEHOLDER;}
    static get CHAT__NO_CHATS() {return localLibrary.Chat.NO_CHATS;}

    static get SEARCH__NO_RESULTS() {return localLibrary.Search.NO_RESULTS;}

    static get LANDING__AUTHED_MSG() {return localLibrary.Landing.AUTHED_MSG;}
    static get LANDING__MAIN_DESCRIPTION() {return localLibrary.Landing.MAIN_DESCRIPTION;}
    static get LANDING__MOBILE_APPS() {return localLibrary.Landing.MOBILE_APPS;}
    static get LANDING__MOTTO() {return localLibrary.Landing.MOTTO;}
    static get LANDING__PREV_WORKS() {return localLibrary.Landing.PREV_WORKS;}
    static get LANDING__RIGHTS() {return localLibrary.Landing.RIGHTS;}
    static get LANDING__SCREEN1_TITLE() {return localLibrary.Landing.SCREEN1_TITLE;}
    static get LANDING__SCREEN1_1() {return localLibrary.Landing.LANDING__SCREEN1_1;}
    static get LANDING__SCREEN1_2() {return localLibrary.Landing.LANDING__SCREEN1_2;}
    static get LANDING__SCREEN1_3() {return localLibrary.Landing.LANDING__SCREEN1_3;}
    static get LANDING__SCREEN1_4() {return localLibrary.Landing.LANDING__SCREEN1_4;}
    static get LANDING__SCREEN2_TITLE() {return localLibrary.Landing.SCREEN2_TITLE;}
    static get LANDING__SHORT_DESCRIPTION() {return localLibrary.Landing.SHORT_DESCRIPTION;}
}
