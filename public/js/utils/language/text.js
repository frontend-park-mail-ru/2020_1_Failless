'use strict';

import EnglishLibrary from 'Eventum/utils/language/English';
import Snackbar from 'Blocks/snackbar/snackbar';

let localLibrary = EnglishLibrary;

// Change this value every time you change libraries
// Also change library version in static/lang/*.json
const libVersion = 4;

export default class TextConstants {
    static LANGUAGES = {
        RUSSIAN: {
            short: 'ru',
            full: 'Русский',
        },
        ENGLISH: {
            short: 'en',
            full: 'English',
        },
        SPANISH: {
            short: 'es',
            full: 'Español',
        }
    };

    /**
     * Prepare local library for chosen language
     * @param lang {'ru' | 'en'}
     * @return {Promise<void>}
     */
    static async translateTo(lang) {
        if (lang === this.LANGUAGES.ENGLISH.short) {
            localLibrary = EnglishLibrary;
            this.setCurrentLanguage(lang);
            return;
        }
        if (!localStorage.getItem(`lib_${lang}_v${libVersion}`)) {
            await this.loadLib(lang);
        } else {
            let newLib = null;
            try {
                newLib = JSON.parse(localStorage.getItem(`lib_${lang}_v${libVersion}`));
            }
            catch (e) {
                newLib = null;
            }
            if (!newLib) {
                await this.loadLib(lang);
            } else {
                localLibrary = newLib;
                this.setCurrentLanguage(lang);
            }
        }
    }

    /**
     * Downloads library, sets it as current + loads into localStorage
     * @param lang {'ru' | 'en'}
     */
    static async loadLib(lang) {
        const controller = new AbortController();
        const signal = controller.signal;
        setTimeout(() => {
            controller.abort();
            if (this.getCurrentLanguage() === this.LANGUAGES.ENGLISH.short) {
                Snackbar.instance.addMessage(TextConstants.ERROR__LIB_DOWNLOAD_FAILED);
            }
        }, 3000);

        await fetch(`/lang/${lang}_v${libVersion}.json`, {method: 'GET', signal})
            .then(r => r.json())
            .then(newLib => {
                localLibrary = newLib;
                localStorage.setItem(`lib_${lang}_v${libVersion}`, JSON.stringify(newLib));
                this.setCurrentLanguage(lang);
            })
            .catch(e => {
                localLibrary = EnglishLibrary;
                this.setCurrentLanguage(this.LANGUAGES.ENGLISH.short);
            })
            .finally(() => this.clearLocalStorage(this.getCurrentLanguage()));

    }

    /**
     * Deletes all old versions of the same library
     * @param lang {'ru' | 'en'}
     * @return {Promise<void>}
     */
    static async clearLocalStorage(lang) {
        for (let iii = 1; iii < libVersion; iii++) {
            localStorage.removeItem(`lib_${lang}_v${iii}`);
        }
    }

    static getCurrentLanguage() {
        return localStorage.getItem('cur_lang');
    }

    static async setCurrentLanguage(lang) {
        localStorage.setItem('cur_lang', lang);
    }

    static get BASIC__ADD() {return localLibrary.Basic.ADD;}
    static get BASIC__AGE() {return localLibrary.Basic.AGE;}
    static get BASIC__CANCEL() {return localLibrary.Basic.CANCEL;}
    static get BASIC__CHANGE() {return localLibrary.Basic.CHANGE;}
    static get BASIC__CHATS() {return localLibrary.Basic.CHATS;}
    static get BASIC__BIRTH() {return localLibrary.Basic.BIRTH;}
    static get BASIC__DESCRIPTION() {return localLibrary.Basic.DESCRIPTION;}
    static get BASIC__ERROR() {return localLibrary.Basic.ERROR;}
    static get BASIC__ERROR_FUN() {return localLibrary.Basic.ERROR_FUN;}
    static get BASIC__ERROR_NO_RIGHTS() {return localLibrary.Basic.ERROR_NO_RIGHTS;}
    static get BASIC__EVENTS() {return localLibrary.Basic.EVENTS;}
    static get BASIC__FIND() {return localLibrary.Basic.FIND;}
    static get BASIC__FROM() {return localLibrary.Basic.FROM;}
    static get BASIC__GENDER() {return localLibrary.Basic.GENDER;}
    static get BASIC__JOIN() {return localLibrary.Basic.JOIN;}
    static get BASIC__LANGUAGE() {return localLibrary.Basic.LANGUAGE;}
    static get BASIC__LOADING() {return localLibrary.Basic.LOADING;}
    static get BASIC__LOCATION() {return localLibrary.Basic.LOCATION;}
    static get BASIC__LOGIN() {return localLibrary.Basic.LOGIN;}
    static get BASIC__MEN() {return localLibrary.Basic.MEN;}
    static get BASIC__NAME() {return localLibrary.Basic.NAME;}
    static get BASIC__NEW_MESSAGE() {return localLibrary.Basic.NEW_MESSAGE;}
    static get BASIC__NO_PHOTOS() {return localLibrary.Basic.NO_PHOTOS;}
    static get BASIC__PASSWORD() {return localLibrary.Basic.PASSWORD;}
    static get BASIC__PHONE() {return localLibrary.Basic.PHONE;}
    static get BASIC__PHOTOS() {return localLibrary.Basic.PHOTOS;}
    static get BASIC__PROFILE() {return localLibrary.Basic.PROFILE;}
    static get BASIC__RANDOM_NAME() {return localLibrary.Basic.RANDOM_NAME;}
    static get BASIC__REPO() {return localLibrary.Basic.REPO;}
    static get BASIC__REPOS() {return localLibrary.Basic.REPOS;}
    static get BASIC__SAVE() {return localLibrary.Basic.SAVE;}
    static get BASIC__SEARCH() {return localLibrary.Basic.SEARCH;}
    static get BASIC__SEND() {return localLibrary.Basic.SEND;}
    static get BASIC__SETTINGS() {return localLibrary.Basic.SETTINGS;}
    static get BASIC__SIGNUP() {return localLibrary.Basic.SIGNUP;}
    static get BASIC__SOCIAL_NETWORKS() {return localLibrary.Basic.SOCIAL_NETWORKS;}
    static get BASIC__TAGS() {return localLibrary.Basic.TAGS;}
    static get BASIC__TIME() {return localLibrary.Basic.TIME;}
    static get BASIC__TITLE() {return localLibrary.Basic.TITLE;}
    static get BASIC__TO() {return localLibrary.Basic.TO;}
    static get BASIC__VISIT() {return localLibrary.Basic.VISIT;}
    static get BASIC__WOMEN() {return localLibrary.Basic.WOMEN;}
    static get BASIC__YOU() {return localLibrary.Basic.YOU;}

    static get EVENT__ADD_PHOTO() {return localLibrary.Event.ADD_PHOTOS;}
    static get EVENT__INVITE_SENT() {return localLibrary.Event.INVITE_SENT;}
    static get EVENT__LEAVE() {return localLibrary.Event.LEAVE;}
    static get EVENT__RANDOM_ABOUT() {return localLibrary.Event.RANDOM_ABOUT;}
    static get EVENT__RANDOM_TITLE() {return localLibrary.Event.RANDOM_TITLE;}
    static get EVENT__SHOW_MEMBERS() {return localLibrary.Event.SHOW_MEMBERS;}
    static get EVENT__VISITED() {return localLibrary.Event.VISITED;}
    static get EVENT__UNVISITED() {return localLibrary.Event.UNVISITED;}
    static get EVENT__YOU_GO() {return localLibrary.Event.YOU_GO;}

    static get FILTERS__KEYWORDS_HEADER() {return localLibrary.Filters.KEYWORDS_HEADER;}
    static get FILTERS__KEYWORDS_PLACEHOLDER() {return localLibrary.Filters.KEYWORDS_PLACEHOLDER;}
    static get FILTERS__MEMBER_AMOUNT() {return localLibrary.Filters.MEMBER_AMOUNT;}
    static get FILTERS__TAGS_HEADER() {return localLibrary.Filters.TAGS_HEADER;}

    static get FEED__EMPTY() {return localLibrary.Feed.EMPTY;}
    static get FEED__NEW_MATCH() {return localLibrary.Feed.NEW_MATCH;}
    static get FEED__NO_EVENTS() {return localLibrary.Feed.NO_EVENTS;}
    static get FEED__NO_SUBS() {return localLibrary.Feed.NO_SUBS;}
    static get FEED__PAY_TO_SKIP() {return localLibrary.Feed.PAY_TO_SKIP;}
    static get FEED__PERSONAL_EVENTS_HEADER() {return localLibrary.Feed.PERSONAL_EVENTS_HEADER;}
    static get FEED__SUBSCRIPTIONS_HEADER() {return localLibrary.Feed.SUBSCRIPTIONS_HEADER;}

    static get PROFILE__ABOUT() {return localLibrary.Profile.ABOUT;}
    static get PROFILE__ABOUT_PLACEHOLDER() {return localLibrary.Profile.ABOUT_PLACEHOLDER;}
    static get PROFILE__ADD_ABOUT() {return localLibrary.Profile.ADD_ABOUT;}
    static get PROFILE__ADD_PHOTO() {return localLibrary.Profile.ADD_PHOTO;}
    static get PROFILE__FIND_EVENT() {return localLibrary.Profile.FIND_EVENT;}
    static get PROFILE__NO_EVENTS() {return localLibrary.Profile.NO_EVENTS;}
    static get PROFILE__NO_SUBS() {return localLibrary.Profile.NO_SUBS;}
    static get PROFILE__NO_TAGS() {return localLibrary.Profile.NO_TAGS;}
    static get PROFILE__OPEN_PROFILE() {return localLibrary.Profile.OPEN_PROFILE;}
    static get PROFILE__SUCCESSFUL_SAVE() {return localLibrary.Profile.SUCCESSFUL_SAVE;}
    static get PROFILE__TITLE() {return localLibrary.Profile.TITLE;}
    static get PROFILE__YOU_VISIT() {return localLibrary.Profile.YOU_VISIT;}
    static get PROFILE__YOUR_EVENTS() {return localLibrary.Profile.YOUR_EVENTS;}
    static get PROFILE__YOUR_PHOTOS() {return localLibrary.Profile.YOUR_PHOTOS;}
    static get PROFILE__YOUR_TAGS() {return localLibrary.Profile.YOUR_TAGS;}

    static get AUTH__LOGIN_LABEL() {return localLibrary.Auth.LOGIN_LABEL;}
    static get AUTH__LOGIN_TITLE() {return localLibrary.Auth.LOGIN_TITLE;}
    static get AUTH__LOGOUT() {return localLibrary.Auth.LOGOUT;}
    static get AUTH__REG_ACTION() {return localLibrary.Auth.REG_ACTION;}
    static get AUTH__NEW_PASS() {return localLibrary.Auth.NEW_PASS;}
    static get AUTH__OLD_PASS() {return localLibrary.Auth.OLD_PASS;}
    static get AUTH__PASS_ERROR() {return localLibrary.Auth.PASS_ERROR;}
    static get AUTH__REPEAT_PASS() {return localLibrary.Auth.REPEAT_PASS;}
    static get AUTH__SUCCESSFUL_SIGNUP() {return localLibrary.Auth.SUCCESSFUL_SIGNUP;}

    static get VALID__PASS_EMPTY_OR_INVALID() {return localLibrary.Valid.PASS_EMPTY_OR_INVALID;}
    static get VALID__PASS_FEW_NUMS() {return localLibrary.Valid.PASS_FEW_NUMS;}
    static get VALID__PASS_NO_LATIN() {return localLibrary.Valid.PASS_NO_LATIN;}
    static get VALID__PASS_NO_MATCH() {return localLibrary.Valid.PASS_NO_MATCH;}
    static get VALID__PASS_NO_NUMS() {return localLibrary.Valid.PASS_NO_NUMS;}
    static get VALID__PASS_NUMS_AND_LATIN() {return localLibrary.Valid.PASS_NUMS_AND_LATIN;}
    static get VALID__PASS_SECOND_BAD() {return localLibrary.Valid.PASS_SECOND_BAD;}
    static get VALID__PASS_SHORT() {return localLibrary.Valid.PASS_SHORT;}
    static get VALID__EMAIL_EMPTY_OR_INVALID() {return localLibrary.Valid.EMAIL_EMPTY_OR_INVALID;}
    static get VALID__EMAIL_MSG() {return localLibrary.Valid.EMAIL_MSG;}
    static get VALID__EMAIL_LONG() {return localLibrary.Valid.EMAIL_LONG;}
    static get VALID__PHONE_EMPTY_OR_INVALID() {return localLibrary.Valid.PHONE_EMPTY_OR_INVALID;}
    static get VALID__PHONE_SHORT() {return localLibrary.Valid.PHONE_SHORT;}
    static get VALID__PHONE_LONG() {return localLibrary.Valid.PHONE_LONG;}
    static get VALID__PHONE_MSG() {return localLibrary.Valid.PHONE_MSG;}
    static get VALID__NAME_EMPTY_OR_INVALID() {return localLibrary.Valid.NAME_EMPTY_OR_INVALID;}
    static get VALID__NAME_CAPITAL() {return localLibrary.Valid.NAME_CAPITAL;}
    static get VALID__NAME_LONG() {return localLibrary.Valid.NAME_LONG;}

    static get CHAT__ATTENTION_MESSAGE() {return localLibrary.Chat.ATTENTION_MESSAGE;}
    static get CHAT__LEFT_CHAT() {return localLibrary.Chat.LEFT_CHAT;}
    static get CHAT__MESSAGE_PLACEHOLDER() {return localLibrary.Chat.MESSAGE_PLACEHOLDER;}
    static get CHAT__NO_CHATS() {return localLibrary.Chat.NO_CHATS;}

    static get SEARCH__PLACEHOLDER() {return localLibrary.Search.PLACEHOLDER;}
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
    static get LANDING__SHORT_DESCRIPTION() {return localLibrary.Landing.SHORT_DESCRIPTION;}

    static get TAGS__BAR() {return localLibrary.Tags.BAR;}
    static get TAGS__CINEMA() {return localLibrary.Tags.CINEMA;}
    static get TAGS__CLUB() {return localLibrary.Tags.CLUB;}
    static get TAGS__CONCERT() {return localLibrary.Tags.CONCERT;}
    static get TAGS__EXHIBITION() {return localLibrary.Tags.EXHIBITION;}
    static get TAGS__FIREWORKS() {return localLibrary.Tags.FIREWORKS;}
    static get TAGS__LECTURE() {return localLibrary.Tags.LECTURE;}
    static get TAGS__MUSEUM() {return localLibrary.Tags.MUSEUM;}
    static get TAGS__OUTSIDE() {return localLibrary.Tags.OUTSIDE;}
    static get TAGS__PARK() {return localLibrary.Tags.PARK;}
    static get TAGS__RINK() {return localLibrary.Tags.RINK;}
    static get TAGS__SLEEP() {return localLibrary.Tags.SLEEP;}
    static get TAGS__SPORT() {return localLibrary.Tags.SPORT;}
    static get TAGS__STUDY() {return localLibrary.Tags.STUDY;}
    static get TAGS__THEATRE() {return localLibrary.Tags.THEATRE;}

    static get ERROR__LIB_DOWNLOAD_FAILED() {return localLibrary.Error.LIB_DOWNLOAD_FAILED;}

    static get SERVICE__EMAIL_SENT() {return localLibrary.Service.EMAIL_SENT;}
    static get SERVICE__NOTIFY() {return localLibrary.Service.NOTIFY;}
    static get SERVICE__CONSTRUCTION() {return localLibrary.Service.CONSTRUCTION;}
}
