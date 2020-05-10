'use strict';

// Some sort of encapsulation
// since these are hidden in a module
// TODO: wouldn't it be possible to access them via window.* ??
const LANGUAGES = {
    RUSSIAN: 'Russian',
    ENGLISH: 'English',
};

let Library = {
    Event: EventTextsInterface,
};

const EventTextsInterface = {
    VISITED: '',
    UNVISITED: '',
    LEAVE: '',
};

const EventTextsRussian = {
    VISITED: 'Вы идёте',
    UNVISITED: 'Пойти',
    LEAVE: 'Не идти',
};

export default class TextConstants {
    static translateToRussian() {
        if (TextConstants.currentLanguage === LANGUAGES.RUSSIAN) {return;}
        TextConstants.currentLanguage = LANGUAGES.RUSSIAN;
        Library = {
            Event: EventTextsRussian,
        };
    }

    static get EVENT_VISITED() {return Library.Event.VISITED;}
    static get EVENT_UNVISITED() {return Library.Event.UNVISITED;}
    static get EVENT_LEAVE() {return Library.Event.LEAVE;}
}
