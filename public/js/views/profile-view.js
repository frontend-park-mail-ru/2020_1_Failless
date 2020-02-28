'use strict';

import View from '../core/view.js';

let profilePhotos = ['ProfilePhotos/1.jpg', 'ProfilePhotos/2.jpg', 'ProfilePhotos/3.jpg'];
const getBlocks = (profilePhotos) => {
    let blocks = [];
    profilePhotos.forEach(elem => {
        blocks.push({
            block: 'profile',
            elem: 'photo',
            mods: {'me': true},
            tag: 'img',
            attrs: {src: '' + elem}
        });
    });
    return blocks;
};

const tagNames = ['#хочувБАР', '#хочувКИНО', '#хочунаКАТОК', '#хочуГУЛЯТЬ', '#хочуКУШАЦ', '#хочуСПАТЬ'];

const getTags = (tagNames) => {
    let blocks = [];
    tagNames.forEach(elem => {
        blocks.push({
            block: 'tag',
            mods: {'size': 'middle'},
            content: elem,
        });
    });
    return blocks;
};

const eventPhotos = ['EventPhotos/3.jpg', 'EventPhotos/4.jpg'];
const getEventPhotos = (eventPhotos) => {
    let blocks = [];
    eventPhotos.forEach((elem) => {
        blocks.push({
            elem: 'item',
            mix: {block: 'event__item', mods: {'one': true}},
            tag: 'img',
            attrs: {src: elem}
        });
    });
    return blocks;
};
/**
 *
 */
export default class ProfileView extends View {

    /**
     * Create view
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.parent = parent;
    }

    /**
     * Render template
     */
    render() {

        let allowEdit = true;
        const template = [
            {
                block: 'profile',
                content: [
                    {
                        elem: 'title',
                        tag: 'h1',
                        content: 'Профиль',
                    },
                    {
                        elem: 'page',
                        content: [
                            {
                                elem: 'column',
                                mix: {block: 'profile', elem: 'filed'},
                                content: [
                                    {
                                        elem: 'title',
                                        mix: {block: 'profile__title_blue'},
                                        tag: 'h3',
                                        content: 'О себе',
                                    },
                                    {
                                        block: 'input',
                                        mix: {block: 'input__text_small'},
                                        tag: 'textarea',
                                        attrs: {placeholders: 'Расскажите о себе и своих увлечениях'},
                                    },
                                    {
                                        elem: 'btn',
                                        content: allowEdit ? [
                                            {
                                                block: 'btn',
                                                mods: {color: 'muted', size: 'middle'},
                                                btnText: 'Готово',
                                                attrs: {type: 'submit'},
                                            },
                                            {
                                                block: 'btn',
                                                mods: {color: 'gray', size: 'middle'},
                                                btnText: 'Настройки',
                                            },
                                        ] : []
                                    },
                                ],
                            },
                            {
                                elem: 'column',
                                mix: {block: 'profile', elem: 'filed'},
                                content: [
                                    {
                                        elem: 'title',
                                        mix: {block: 'profile__title_blue'},
                                        tag: 'h3',
                                        content: 'Ваши фото'
                                    },
                                    {
                                        elem: 'photos',
                                        content: {
                                            block: 'profile',
                                            elem: 'photo_container',
                                            mods: {'me': true},
                                            tag: 'img',
                                            attrs: {src: ''}
                                        },//getBlocks(profilePhotos),
                                    },
                                    {
                                        block: 'icon',
                                        elem: 'input',
                                        mix: [{block: 'icon', elem: 'add'}, {block: 'icon', mods: {'size': 'x'}}],
                                        tag: 'input',
                                        attrs: { type: 'file' },
                                        content: 'Добавить фото'
                                    },
                                ],
                            },
                            {
                                elem: 'column',
                                mix: {block: 'profile', elem: 'filed'},
                                content: [
                                    {
                                        elem: 'title',
                                        mix: {block: 'profile__title_blue'},
                                        tag: 'h3',
                                        content: 'Ваши тэги',
                                    },
                                    {
                                        block: 'icon',
                                        mix: [{block: 'icon', elem: 'add'}, {block: 'icon', mods: {'size': 'x'}}],
                                    },
                                    {
                                        elem: 'tags',
                                        content: getTags(tagNames),
                                    },
                                    {
                                        elem: 'title',
                                        mix: {block: 'profile__title_blue'},
                                        tag: 'h3',
                                        content: 'Ваши эвенты',
                                    },
                                    {
                                        block: 'icon',
                                        mix: [{block: 'icon', elem: 'add'}, {block: 'icon', mods: {'size': 'x'}}],
                                    },
                                    {
                                        elem: 'events',
                                        content: [
                                            {
                                                block: 'event',
                                                content: [
                                                    {
                                                        elem: 'photos',
                                                        content: getEventPhotos(eventPhotos),
                                                    },
                                                    {
                                                        elem: 'title',
                                                        content: 'Концерт',
                                                    },
                                                    {
                                                        elem: 'place',
                                                        content: 'Москва',
                                                    },
                                                    {
                                                        elem: 'description',
                                                        content: 'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            }
                        ],
                    },
                ]
            }
        ];
        this.parent.insertAdjacentHTML('beforeend', bemhtml.apply(template));
    }
}