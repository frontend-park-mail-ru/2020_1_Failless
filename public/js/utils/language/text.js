'use strict';

import RussianLibrary from 'Eventum/utils/language/libraries/Russian';
import Library from 'Eventum/utils/language/libraries/Interface';

// Some sort of encapsulation
// since these are hidden in a module
// TODO: wouldn't it be possible to access them via window.* ??
const LANGUAGES = {
    RUSSIAN: 'Russian',
    ENGLISH: 'English',
};

let localLibrary = Library;

export default class TextConstants {
    static translateToRussian() {
        if (TextConstants.currentLanguage === LANGUAGES.RUSSIAN) {
            return;
        }
        TextConstants.currentLanguage = LANGUAGES.RUSSIAN;
        localLibrary = RussianLibrary;
    }

    static translateToEnglish() {
        if (TextConstants.currentLanguage === LANGUAGES.ENGLISH) {
            return;
        }
        // TODO: make english
        TextConstants.currentLanguage = LANGUAGES.RUSSIAN;
        localLibrary = RussianLibrary;
    }

    static get BASIC__ADD() {return localLibrary.Basic.ADD;}
    static get BASIC__AGE() {return localLibrary.Basic.AGE;}
    static get BASIC__CHANGE() {return localLibrary.Basic.CHANGE;} // Изменить
    static get BASIC__CHATS() {return localLibrary.Basic.CHATS;} // Чаты
    static get BASIC__EVENTS() {return localLibrary.Basic.EVENTS;}
    static get BASIC__FIND() {return localLibrary.Basic.FIND;}
    static get BASIC__FROM() {return localLibrary.Basic.FROM;}
    static get BASIC__GENDER() {return localLibrary.Basic.GENDER;}
    static get BASIC__LOCATION() {return localLibrary.Basic.LOCATION;}
    static get BASIC__MEN() {return localLibrary.Basic.MEN;}
    static get BASIC__NEW_MESSAGE() {return localLibrary.Basic.NEW_MESSAGE;}
    static get BASIC__NO_PHOTOS() {return localLibrary.Basic.NO_PHOTOS;}
    static get BASIC__PHOTOS() {return localLibrary.Basic.PHOTOS;}
    static get BASIC__SAVE() {return localLibrary.Basic.SAVE;}
    static get BASIC__SEND() {return localLibrary.Basic.SEND;} // Отправить
    static get BASIC__SOCIAL_NETWORKS() {return localLibrary.Basic.SOCIAL_NETWORKS;}
    static get BASIC__TO() {return localLibrary.Basic.TO;}
    static get BASIC__VISIT() {return localLibrary.Basic.VISIT;} // Пойти
    static get BASIC__WOMEN() {return localLibrary.Basic.WOMEN;}
    static get BASIC__YOU() {return localLibrary.Basic.YOU;}
    static get BASIC__YOU_GO() {return localLibrary.Basic.YOU_GO;} // Вы идёте

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

    static get PROFILE__NO_TAGS() {return localLibrary.Profile.NO_TAGS;}
    static get PROFILE__SUCCESSFUL_SAVE() {return localLibrary.Profile.SUCCESSFUL_SAVE;}
    static get PROFILE__TITLE() {return localLibrary.Profile.TITLE;} // Профиль
    static get PROFILE__YOU_VISIT() {return localLibrary.Profile.YOU_VISIT;}
    static get PROFILE__YOUR_EVENTS() {return localLibrary.Profile.YOUR_EVENTS;}
    static get PROFILE__YOUR_PHOTOS() {return localLibrary.Profile.YOUR_PHOTOS;}
    static get PROFILE__YOUR_TAGS() {return localLibrary.Profile.YOUR_TAGS;}

    static get AUTH__SUCCESSFUL_SIGNUP() {return localLibrary.Auth.SUCCESSFUL_SIGNUP;}

    static get CHAT__ATTENTION_MESSAGE() {return localLibrary.Chat.ATTENTION_MESSAGE;} // Будьте осторожны при разговоре с незнакомцами
    static get CHAT__LEFT_CHAT() {return localLibrary.Chat.LEFT_CHAT;} // Выберите чат слева
    static get CHAT__MESSAGE_PLACEHOLDER() {return localLibrary.Chat.MESSAGE_PLACEHOLDER;} // Напишите что-нибудь хорошее
    static get CHAT__NO_CHATS() {return localLibrary.Chat.NO_CHATS;} // На горизонте тихо...
}
