'use strict';

import ProfileView from 'Eventum/views/profile-view';
import UserModel from 'Eventum/models/user-model';
import ProfileEditView from 'Eventum/views/profile-edit-view';
import ModalView from 'Eventum/views/modal-view';
import {STATIC_TAGS} from 'Eventum/utils/static-data';
import {highlightTag} from 'Eventum/utils/tag-logic';
import {logoutRedirect} from 'Eventum/utils/user-utils';
import EventModel from 'Eventum/models/event-model';
import editTemplate from 'Blocks/edit-field/template.hbs';
import imageEditTemplate from 'Blocks/image-edit/template.hbs';
import {makeEmpty, resizeTextArea} from 'Eventum/utils/basic';
import Router from 'Eventum/core/router';
import Controller from 'Eventum/core/controller';
import {CircleRedirect} from 'Blocks/circle/circle';
import {toggleActionText} from 'Blocks/event/event';
import settings from 'Settings/config';

/**
 * @class ProfileController
 */
export default class ProfileController extends Controller {

    /**
     * construct object of ProfileController class
     * @param parent {HTMLElement}
     */
    constructor(parent) {
        super(parent);
        this.view = new ProfileView(parent);
        this.editView = null;
        this.image = '';
        this.user = null;
        this.activeModalWindow = null;
        this.images = [];
        EventModel.getTagList().then((tags) => {
            this.localTags = [...tags];
        }).catch((onerror) => {
            console.error(onerror);
            this.localTags = [...STATIC_TAGS];
        });
    }

    destructor() {
        this.view.destructor();
        super.destructor();
    }

    /**
     * Create action
     */
    action() {
        super.action();
        // todo: check is user allowed to see this
        UserModel.getProfile()
            .then((profile) => {
                if (!profile) {
                    console.error('Server error');
                    console.log(profile);
                    return;
                }
                if (Object.prototype.hasOwnProperty.call(profile, 'about')) {
                    // Prepare profile photos
                    if (profile.photos) {
                        profile.photos = profile.photos.map(photo => {
                            return {
                                src: `${settings.aws}/users/${photo.path}`,
                                alt: photo.path,
                                data_photo_id: this.images.push({img: photo.path, state: 'old'}),
                            };
                        });
                    }

                    this.view.render(profile);
                    EventModel.getUserOwnEvents(profile.uid).then(
                        (events) => {this.view.renderEvents(events);},
                        (error) => {this.view.renderEventsError(error);}
                    );
                    EventModel.getUserSubscriptions(profile.uid).then(
                        (subscriptions) => {this.view.renderSubscriptions(subscriptions);},
                        (error) => {this.view.renderSubscriptionsError(error);}
                    );
                    (async () => {this.view.leftHeaderDiv.querySelectorAll('.circle')[2].classList.add('circle_active');})();
                    this.user = profile;

                    this.initHandlers([
                        {
                            attr: 'logout',
                            events: [
                                {type: 'click', handler: logoutRedirect},
                            ]
                        },
                        {
                            attr: 'photoUpload',
                            events: [
                                {type: 'change', handler: this.#handleFile},
                            ]
                        },
                        {
                            attr: 'saveMeta',
                            events: [
                                {type: 'click', handler: this.#handleInfo},
                            ]
                        },
                        {
                            attr: 'showSettings',
                            events: [
                                {type: 'click', handler: this.#profileSettings},
                            ]
                        },
                        {
                            attr: 'showModalTags',
                            many: true,
                            events: [
                                {type: 'click', handler: this.#showModalTags},
                            ]
                        },
                        {
                            attr: 'removeTags',
                            events: [
                                {type: 'click', handler: this.#removeTag},
                            ]
                        },
                        {
                            attr: 'showAddEvent',
                            events: [
                                {type: 'click', handler: () => {this.view.eventEditComp.show();}},
                            ]
                        },
                        {
                            attr: 'circleRedirect',
                            events: [
                                {type: 'click', handler: CircleRedirect},
                            ]
                        },
                        {
                            attr: 'resizeTextArea',
                            many: true,
                            events: [
                                {type: 'input', handler: resizeTextArea},
                            ]
                        },
                        {
                            attr: 'removeUserImage',
                            events: [
                                {type: 'click', handler: this.#removeUserImage},
                            ]
                        },
                        {
                            attr: 'addNewEventOnClick',
                            events: [
                                {type: 'click', handler: this.#submitNewEvent}
                            ]
                        },
                        {
                            attr: 'cancelNewEvent',
                            events: [
                                {type: 'click', handler: () => {this.view.eventEditComp.hide();}}
                            ]
                        },
                        {
                            attr: 'previewImagesForEvent',
                            events: [
                                {type: 'change', handler: this.#previewImagesForEvent}
                            ]
                        },
                        {
                            attr: 'removePreviewImage',
                            events: [
                                {type: 'click', handler: (event) => {
                                    if (event.target.matches('.image-edit__close-icon_inner')) {
                                        this.view.eventEditComp.removePreviewImage(event.target);
                                    }
                                }},
                            ]
                        },
                        {
                            attr: 'showAction',
                            events: [
                                {type: 'mouseover', handler: (event) => {
                                    if (event.target.matches('.event__link.font__color_green')) {
                                        toggleActionText(event.target, 'Не идти');
                                    }}},
                                {type: 'click', handler: (event) => {
                                    if (event.target.matches('.event__link.font__color_red')) {
                                        this.#unfollowEvent(event.target);
                                    } else if (event.target.matches('button.error__button')) {
                                        Router.redirectForward('/search');
                                    }}},
                                {type: 'mouseout', handler: (event) => {
                                    if (event.target.matches('.event__link.font__color_red')) {
                                        toggleActionText(event.target, 'Вы идёте');
                                    }}},
                            ]
                        },
                    ]);
                } else {
                    console.error('You have no rights for this page');
                    console.log(profile);
                }
            }).catch(onerror => {
                console.error(onerror);
            });
    }

    /***********************************************
                         Events
     ***********************************************/

    #previewImagesForEvent = (event) => {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            FR.addEventListener('load', this.view.eventEditComp.previewImages());
            FR.readAsDataURL(event.target.files[0]);
        }
    };

    #unfollowEvent = (linkElement) => {
        UserModel.getProfile().then(
            (profile) => {

                let eid = linkElement.getAttribute('data-eid');

                let eventIndexAndSource = this.view.findEventComponentIndex(Number(eid));

                if (eventIndexAndSource.index === -1) {
                    console.error('No component was found');
                    // TODO: do sth
                    return;
                }

                let eventComponent = eventIndexAndSource.source[eventIndexAndSource.index];

                if (eventComponent.type === 'mid') {
                    EventModel.leaveMidEvent(profile.uid, eid)
                        .then((response) => {
                            eventComponent.removeComponent('smooth');
                            eventIndexAndSource.source = eventIndexAndSource.source.splice(eventIndexAndSource.index, 1);
                        });
                } else {
                    console.log('we dont support that type yet');
                }
            },
            error => console.error(error)
        );
    };

    #submitNewEvent = (event) => {
        // Validate data
        const eventEditComp = this.view.eventEditComp;
        let data = eventEditComp.retrieveData();
        if (!eventEditComp.validateData(data)) {
            // TODO: show error
            console.log('title is empty');
            return;
        }

        // Submit form to backend
        let request = {
            title:          data.title,
            description:    data.about === '' ? null : data.about,
            limit:          data.limit,
            date:           data.time === '' ? null : new Date(data.time).toISOString(),
            photos:         data.photos,
            public:         data.public,
        };

        UserModel.getProfile().then(profile => {
            request.uid = +profile.uid;
            if (data.limit === 2) {
                request.tags = data.tags;
                Promise.all([
                    EventModel.createSmallEvent(request),
                    this.view.renderNewEventLoading(),
                ]).then(responses => {
                    this.view.renderNewEvent(responses[0], 'small', responses[1]);
                }).catch(console.error);
            } else {
                request.tag_id = data.tags[0];
                request.private = true;
                request.type = null;
                Promise.all([
                    EventModel.createMidEvent(request),
                    this.view.renderNewEventLoading(),
                ]).then(responses => {
                    this.view.renderNewEvent(responses[0], 'mid', responses[1]);
                }).catch(console.error);
            }
            eventEditComp.hide();
        });
    };

    /***********************************************
                      User photos
     ***********************************************/

    #handleFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            this.addEventHandler(FR, 'load', this.#handleSelectImg);
            FR.readAsDataURL(event.target.files[0]);
        }
    };

    /**
     * Preview selected image and draw manage buttons
     * @param {Event} event
     */
    #handleSelectImg = (event) => {
        event.preventDefault();

        const files = this.view.mainColumnDiv.querySelector('input#photoUpload').files;
        if (!files || files.length === 0) {
            console.log('empty files');
            return;
        }

        for (let iii = 0; iii < files.length; iii++) {
            const FR = new FileReader();

            FR.addEventListener('load', (event) => {
                const dataPhotoId = this.images.push({state: 'new', img: event.target.result.split(';')[1].split(',')[1]});
                this.view.photosColumn.insertAdjacentHTML('beforeend', imageEditTemplate({
                    data_photo_id: dataPhotoId,
                    src: event.target.result,
                }));
            });

            FR.readAsDataURL(files[iii]);
        }
    };

    #removeUserImage = (event) => {
        if (event.target.classList.contains('image-edit__close-icon')
            ||
            event.target.classList.contains('image-edit__close-icon_inner'))
        {
            let imageEditDiv = event.target.closest('.image-edit');
            this.images[Number(imageEditDiv.getAttribute('data-photo-id')) - 1].img = null;
            imageEditDiv.remove();
        }
    };

    /**
     * Handle meta information such as tags, social and about
     * @param {Event} event
     */
    #handleInfo = (event) => {
        event.preventDefault();

        // Set options
        const textInput = document.getElementsByClassName('textarea')[0];
        const tags = document.querySelectorAll('.tag');
        let selectedTags = [];
        tags.forEach((tag) => {
            selectedTags.push(+tag.getAttribute('data-id'));
        });

        const userProfile = {
            uid: this.user.uid,
            tags: selectedTags,
            about: textInput.value, // TODO: check if it's safe
            social: this.user.links,
            photos: this.images.some(image => image.state === 'old' ? !image.img : image.img)
                ? this.images.map(image => {if (image.img) {return image.img;}})
                : null,
        };

        console.log(userProfile);

        this.removeErrorMessage(event);

        // Send request
        UserModel.putProfile(userProfile)
            .then(response => {
                if (Object.prototype.hasOwnProperty.call(response, 'message')) {
                    this.view.addErrorMessage(document.getElementsByClassName('re_btn re_btn__filled')[0], [response.message]);
                } else {
                    console.log('ok', response);
                }
            })
            .catch(reason => console.log('ERROR', reason));
    };

    // TODO: move it to view
    /**
     * Show modal window with tags settings
     * @param {Event} event
     */
    #showModalTags = (event) => {
        event.preventDefault();
        this.editView = new ModalView(document.body);
        let tags = STATIC_TAGS.map((tag) => {tag.editable = true; tag.activeClass = ''; return tag;});
        console.log(tags);
        this.editView.render({
            title: 'Ваши теги',
            tags: tags,
            last_buttons: [{title: 'ОК'}]
        });

        // Adding event handlers
        let modalBG = document.body.querySelector('.modal__bg');
        modalBG.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
        this.activeModalWindow = modalBG.firstElementChild;
        this.activeModalWindow.querySelector('.modal__body').addEventListener(
            'click', highlightTag, false);
        this.activeModalWindow.querySelector('.modal__header-icon').addEventListener(
            'click', (event) => {
                event.preventDefault();
                this.editView.clear();
                this.editView = null;
            });

        let activeTags = null;
        let submitHandler = null;
        if (event.target.matches('a')) {
            activeTags = this.view.leftColumnDiv.querySelectorAll('.tag__container.tag__container_active');
            submitHandler = this.#submitTagsHandler;
        } else {
            activeTags = this.view.eventEditComp.element.querySelectorAll('.tag__container');
            submitHandler = (event) => {
                event.preventDefault();
                let finalTags = [];
                let activatedTags = this.activeModalWindow.querySelectorAll('.tag__container_active');
                if (activatedTags && activatedTags.length > 0) {
                    activatedTags.forEach((tag) => {
                        finalTags.push({
                            activeClass: 'tag__container_active',
                            tag_id: tag.firstElementChild.getAttribute('data-id'),
                            name: tag.firstElementChild.innerText.slice(1),
                        });
                    });
                }
                this.view.eventEditComp.addTags(finalTags);
                this.editView.clear();
                this.editView = null;
            };
        }

        // Rendering active tags in modal view
        if (activeTags && activeTags.length > 0) {
            console.log(activeTags);
            let activeTagIds = [];
            activeTags.forEach((activeTag) => {activeTagIds.push(+activeTag.firstElementChild.getAttribute('data-id'));});
            this.activeModalWindow.querySelectorAll('.tag__container').forEach((tag) => {
                if (activeTagIds.includes(+tag.firstElementChild.getAttribute('data-id'))) {
                    tag.classList.add('tag__container_active');
                }
            });
        }

        // Submit event handler
        this.activeModalWindow.querySelector(
            '.modal__footer').querySelector(
            '.re_btn.re_btn__outline').addEventListener(
            'click', submitHandler, false);
    };

    #submitTagsHandler = (event) => {
        event.preventDefault();

        let tagsField = document.body.querySelector('.profile-left__tags');
        let prevLength = tagsField.length;

        makeEmpty(tagsField);

        let allTags = this.activeModalWindow.querySelectorAll('.tag__container');
        this.localTags = [];
        let length = 0;
        allTags.forEach((tag) => {
            let tempTag = {
                name: tag.firstElementChild.innerText,
                tag_id: tag.firstElementChild.getAttribute('data-id'),
                editable: true,
            };
            if (tag.classList.contains('tag__container_active')) {
                tempTag.activeClass = 'tag__container_active';
                tagsField.appendChild(tag);
                length++;
            }
            this.localTags.push(tempTag);
        });

        if (length === 0) {
            let emptyMessageText = (prevLength !== 0)
                ? 'Вы удалили все теги'
                : 'У вас пока нет ни одного тэга';
            // TODO: replace with HBS block
            let emptyMessage = document.createElement('div');
            emptyMessage.classList.add('center');
            let message = document.createElement('span');
            message.classList.add('font', 'font_bold', 'font__size_small', 'font__color_lg');
            message.innerText = emptyMessageText;
            emptyMessage.appendChild(message);
            tagsField.appendChild(emptyMessage);
        }

        this.editView.clear();
        this.editView = null;
    };

    #removeTag = (event) => {
        let elem = event.target;
        let elemContainer = elem.closest('.tag__container');
        if (elemContainer && elemContainer.classList.contains('tag__container')) {
            delete this.localTags.find((tag) => {
                return (tag.title === elemContainer.firstElementChild.innerText);
            }).activeClass;

            // Check if it was the last tag
            if (elemContainer.parentElement.childElementCount === 1) {
                // TODO: replace with HBS block
                let emptyMessage = document.createElement('div');
                emptyMessage.classList.add('center');
                let message = document.createElement('span');
                message.classList.add('font', 'font_bold', 'font__size_small', 'font__color_lg');
                message.innerText = 'Вы удалили все теги';
                emptyMessage.appendChild(message);
                elemContainer.parentElement.appendChild(emptyMessage);
            }

            elemContainer.remove();
        }
    };

    /***********************************************
                    Profile settings
     ***********************************************/

    /**
     * Create profile settings popup
     * @param {Event} event
     */
    #profileSettings = (event) => {
        event.preventDefault();
        this.editView = new ProfileEditView(this.parent);
        this.editView.render(this.user);
        const closeBtn = document.querySelector('.profile-edit__icon');
        this.addEventHandler(closeBtn, 'click', this.#removeProfileSettings);
        const table = document.querySelector('.profile-edit__table');
        this.addEventHandler(table, 'click', this.#drawUnfoldedLine);
    };


    /**
     * Remove profile settings popup
     * @param {Event} event
     */
    #removeProfileSettings = (event) => {
        const popup = document.querySelector('.profile-edit');
        popup.parentNode.removeChild(popup);
        document.removeEventListener('click', this.#removeProfileSettings);
    };

    /**
     *
     * @param {Event} event
     */
    #drawUnfoldedLine = (event) => {
        event.preventDefault();
        console.log(event.target);
        let template = editTemplate();
        if (event.target.tagName === 'A') {
            let filed = event.target.parentNode;
            switch (filed.id) {
            case 'popupPasswd': {
                console.log('draw password field');
                this.editView.renderPasswordForm(filed);
                break;
            }
            case 'popupMail': {
                console.log('draw email field');
                break;
            }
            case 'popupSex': {
                console.log('draw gender field');
                break;
            }
            case 'popupPhone': {
                console.log('draw phone field');
                break;
            }
            case 'popupLang': {
                console.log('draw lang field');
                break;
            }
            case 'popupBirth': {
                console.log('draw lang field');
                break;
            }
            }
        }
    };
}
