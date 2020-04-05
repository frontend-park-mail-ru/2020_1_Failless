function Event(photos, title, place, description) {
    this.photos = photos;
    this.title = title;
    this.place = place;
    this.description = description;
}

const events = [
    new Event(
        ['/EventPhotos/3.jpg', '/EventPhotos/4.jpg'],
        'Концерт',
        'Москва',
        'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'),
    new Event(
        ['/EventPhotos/2.jpg', '/EventPhotos/1.jpg'],
        'Выставка',
        'Ленинград',
        'Выставка Ван-Гога. Обещают привезти главный экспонат')
];

function Tag(title) {
    this.title = '#' + title;
}

const staticTags = [
    new Tag('хочувБАР'),
    new Tag('хочувКИНО'),
    new Tag('хочунаКАТОК'),
    new Tag('хочуГУЛЯТЬ'),
    new Tag('хочуКУШАЦ'),
    new Tag('хочуСПАТЬ'),
    new Tag('хочуСПАТЬ'),
    new Tag('хочуСПАТЬ'),
    new Tag('хочуСПАТЬ'),
    new Tag('хочуСПАТЬ'),
];

export {Event, events, Tag, staticTags};