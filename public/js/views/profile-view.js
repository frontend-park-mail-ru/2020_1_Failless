'use strict';

import View from '../core/view.js';

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

    render() {
        let profilePhotos = ['ProfilePhotos/1.jpg', 'ProfilePhotos/2.jpg', 'ProfilePhotos/3.jpg'];
        const getBlocks = (profilePhotos) => {
          let blocks = [];
          profilePhotos.forEach(elem => {blocks.push({
              block: 'profile',
              elem: 'photo',
              mods: {'me': true},
              tag: 'img',
              attrs: {src: '' + elem}
          })});
          return blocks;
        };
        const photos = [
        ];
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
                                        tag: 'input',
                                        filedName: 'Расскажите о себе и своих увлечениях'
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
                                        block: 'icon',
                                        mix: [{block: 'icon', elem: 'add'}, {block: 'icon', mods: {'size': 'x'}}],
                                    },
                                    {
                                        elem: 'photos',
                                        content: getBlocks(profilePhotos),
                                    },
                                ],
                            },
                        ],
                    },
                ]
            }
        ];
        this.parent.insertAdjacentHTML('beforeend', bemhtml.apply(template));
    }
}