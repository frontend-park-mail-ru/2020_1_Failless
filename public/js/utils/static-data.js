import settings from '../../settings/config.js';

function Event(photos, title, place, description) {
    this.photos = photos;
    this.title = title;
    this.place = place;
    this.description = description;
}

const events = [
    new Event(
        [`${settings.aws}/events/3.jpg`, `${settings.aws}/users/4.jpg`],
        'Концерт',
        'Москва',
        'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'),
    new Event(
        [`${settings.aws}/events/2.jpg`, `${settings.aws}/users/1.jpg`],
        'Выставка',
        'Ленинград',
        'Выставка Ван-Гога. Обещают привезти главный экспонат')
];

function Tag(title) {
    this.title = '#' + title;
}

const tags = [
    new Tag('хочувБАР'),
    new Tag('хочувКИНО'),
    new Tag('хочунаКАТОК'),
    new Tag('хочуГУЛЯТЬ'),
    new Tag('хочуКУШАЦ'),
    new Tag('хочувТЕАТР'),
    new Tag('хочувКЛУБ'),
    new Tag('хочунаКОНЦЕРТ'),
    new Tag('хочунаВЫСТАВКУ'),
    new Tag('хочунаСАЛЮТ'),
    new Tag('хочувСПОРТ'),
    new Tag('хочувМУЗЕЙ'),
    new Tag('хочунаЛЕКЦИЮ'),
    new Tag('хочуБОТАТЬ'),
    new Tag('хочувПАРК'),
];

const MIN_AGE = 18;
const MAX_AGE = 100;

export {Event, events, Tag, tags, MIN_AGE, MAX_AGE};