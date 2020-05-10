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

    static get BASIC__GENDER() {return localLibrary.Basic.GENDER;}
    static get BASIC__MEN() {return localLibrary.Basic.MEN;}
    static get BASIC__WOMEN() {return localLibrary.Basic.WOMEN;}
    static get BASIC__AGE() {return localLibrary.Basic.AGE;}
    static get BASIC__FROM() {return localLibrary.Basic.FROM;}
    static get BASIC__TO() {return localLibrary.Basic.TO;}
    static get BASIC__LOCATION() {return localLibrary.Basic.LOCATION;}
    static get BASIC__FIND() {return localLibrary.Basic.FIND;}

    static get EVENT__VISITED() {return localLibrary.Event.VISITED;}
    static get EVENT__UNVISITED() {return localLibrary.Event.UNVISITED;}
    static get EVENT__LEAVE() {return localLibrary.Event.LEAVE;}

    static get FILTERS__TAGS_HEADER() {return localLibrary.Filters.TAGS_HEADER;}
    static get FILTERS__KEYWORDS_HEADER() {return localLibrary.Filters.KEYWORDS_HEADER;}
    static get FILTERS__KEYWORDS_PLACEHOLDER() {return localLibrary.Filters.KEYWORDS_PLACEHOLDER;}
    static get FILTERS__OTHERS_HEADER() {return localLibrary.Filters.OTHERS_HEADER;}
    static get FILTERS__MEMBER_AMOUNT() {return localLibrary.Filters.MEMBER_AMOUNT;}
}
