import settings from 'Settings/config.js';
import router from 'Eventum/core/router.js';

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

const staticTags = [
    {name: 'хочувБАР',      tag_id: 1},
    {name: 'хочувКИНО',     tag_id: 2},
    {name: 'хочувТЕАТР',    tag_id: 3},
    {name: 'хочувКЛУБ',     tag_id: 4},
    {name: 'хочунаКОНЦЕРТ', tag_id: 5},
    {name: 'хочуГУЛЯТЬ',    tag_id: 6},
    {name: 'хочунаКАТОК',   tag_id: 7},
    {name: 'хочунаВЫСТАВКУ',tag_id: 8},
    {name: 'хочуСПАТЬ',     tag_id: 9},
    {name: 'хочунаСАЛЮТ',   tag_id: 10},
    {name: 'хочувСПОРТ',    tag_id: 11},
    {name: 'хочувМУЗЕЙ',    tag_id: 12},
    {name: 'хочунаЛЕКЦИЮ',  tag_id: 13},
    {name: 'хочуБОТАТЬ',    tag_id: 14},
    {name: 'хочувПАРК',     tag_id: 15},
];

const MIN_AGE = 18;
const MAX_AGE = 100;
const MIN_LIMIT = 2;
const MAX_LIMIT = 15;

const redirects = new Map([
    [
        'SignIn',
        {
            button_title:   'Зарегистрироваться',
            handler:        (event) => {
                event.preventDefault();
                router.redirectForward('/signup');
            }
        },
    ],
    [
        'Profile',
        {
            button_title:   'Открыть профиль',
            handler:        (event) => {
                event.preventDefault();
                router.redirectForward('/my/profile');
            }
        },
    ],
]);

export {Event, events, staticTags, MIN_AGE, MAX_AGE, MIN_LIMIT, MAX_LIMIT, redirects};
