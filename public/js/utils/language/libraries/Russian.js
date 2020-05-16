const BasicTextsRussian = {
    GENDER: 'Пол',
    MEN: 'Мужчины',
    WOMEN: 'Женщины',
    FROM: 'От',
    TO: 'До',
    LOCATION: 'Местоположение',
    FIND: 'Найти',
    AGE: 'Возраст',
};

const EventTextsRussian = {
    VISITED: 'Вы идёте',
    UNVISITED: 'Пойти',
    LEAVE: 'Не идти',
};

const ProfileTextsRussian = {
    SUCCESSFUL_SAVE: 'Информация сохранена',
};

const FiltersTextsRussian = {
    TAGS_HEADER: 'Выберите теги',
    KEYWORDS_HEADER: 'Ключевые слова',
    KEYWORDS_PLACEHOLDER: 'Бар Люди как люди',
    MEMBER_AMOUNT: 'Кол-во участников',
};

const FeedTextsRussian = {
    DISLIKE: 'Дизлайк',
    LIKE: 'Лайк',
    SKIP: 'Пропустить',
    PERSONAL_EVENTS_HEADER: 'Куда зовёт пойти',
    SUBSCRIPTIONS_HEADER: 'Куда сам идёт',
};

const LandingTextsRussian = {
    SMALL_EVENT_TITLE: 'Маленькое мероприятие',
    SMALL_EVENT_DESCRIPTION: 'Создавая мероприятие на двух человек, оно считается "маленьким". Оно не отображается в глобальном поиске, а другие пользователи могут его увидеть, только если вы попадётесь им в ленте',
    SMALL_EVENT_PHOTO: '',
    MID_EVENT_TITLE: 'Среднее мероприятие',
    MID_EVENT_DESCRIPTION: 'Это мероприятие отличается от маленького тем, что у него количество участников больше 2. Это мероприятие отображается в глобальном поиске, а у его участников есть общий чат. Вы можете создавать своё или присоединяться к мероприятиям других людей',
    MID_EVENT_PHOTO: '',
    BIG_EVENT_TITLE: 'Большое мероприятие',
    BIG_EVENT_DESCRIPTION: 'Мероприятие с неограниченным количеством посетителей. Такие мероприятия создают компании-организаторы. Их можно найти только в поиске и при отклике на такое мероприятие - оно отобразится у вас в профиле',
    BIG_EVENT_PHOTO: '',
};

const RussianLibrary = {
    Basic: BasicTextsRussian,
    Event: EventTextsRussian,
    Profile: ProfileTextsRussian,
    Filters: FiltersTextsRussian,
    Feed: FeedTextsRussian,
    Landing: LandingTextsRussian,
};

export default RussianLibrary;
