'use strict';

import ProfileView from 'Eventum/views/profile-view';
import UserModel from 'Eventum/models/user-model';
import ProfileEditView from 'Eventum/views/profile-edit-view';
import ModalView from 'Eventum/views/modal-view';
import {staticTags} from 'Eventum/utils/static-data';
import {highlightTag} from 'Eventum/utils/tag-logic';
import {logoutRedirect} from 'Eventum/utils/user-utils';
import EventModel from 'Eventum/models/event-model';
import editTemplate from 'Blocks/edit-field/template.hbs';
import {makeEmpty, resizeTextArea} from 'Eventum/utils/basic';
import Router from 'Eventum/core/router';
import Controller from 'Eventum/core/controller';
import {CircleRedirect} from 'Blocks/circle/circle';
import {toggleActionText} from 'Blocks/event/event';

/**
 * @class ProfileController
 */
export default class ProfileController extends Controller {

    /**
     * construct object of ProfileController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new ProfileView(parent);
        this.editView = null;
        this.image = '';
        this.user = null;
        this.activeModalWindow = null;
        EventModel.getTagList().then((tags) => {
            this.localTags = [...tags];
        }).catch((onerror) => {
            console.error(onerror);
            this.localTags = [...staticTags];
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
                    this.view.render(profile);
                    EventModel.getUserEvents(profile.uid).then(
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
                                {type: 'change', handler: () => {this.view.eventEditComp.previewImages();}}
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
                                    if (event.target.matches('.event__link')) {
                                        toggleActionText(event.target, 'Не идти');
                                    }}},
                                {type: 'click', handler: (event) => {
                                    if (event.target.matches('.event__link')) {
                                        this.#unfollowEvent(event);
                                    } else if (event.target.matches('button.error__button')) {
                                        Router.redirectForward('/search');
                                    }}},
                                {type: 'mouseout', handler: (event) => {
                                    if (event.target.matches('.event__link')) {
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

    /**
     *
     */
    #unfollowEvent = (event) => {
        UserModel.getProfile().then(
            (profile) => {
                let type = event.target.previousElementSibling.classList.contains('event__circle_mid') ? 'mid-event' : 'big-event';
                EventModel.unfollowEvent(profile.uid, event.target.getAttribute('data-eid'), type)
                    .then((response) => {this.view.removeSubscriptionByLink(event.target);});
            },
            error => console.log(error)
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
            title: data.title,
            description: data.about === '' ? null : data.about,
            limit: data.limit,
            date: data.time === '' ? null : new Date(data.time).toISOString(),
            photos: data.photos,
        };

        // TODO: Show loading
        UserModel.getProfile().then(profile => {
            request.uid = +profile.uid;
            if (data.limit === 2) {
                request.tags = data.tags;

                EventModel.createSmallEvent(request).then(
                    (response) => {
                        // Render results
                        this.view.renderNewEvent(response, 'small');
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                request.tag_id = data.tags[0];
                request.private = true;
                request.type = null;
                EventModel.createEvent(request).then(
                    (response) => {
                        // Render results
                        console.log(response);
                        this.view.renderNewEvent(data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }
            eventEditComp.hide();
        });
    };

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
        console.log(event.target);
        this.image = event.target.result;
        const photoColumn = document.querySelector('.photo-columns');
        const newImage = document.createElement('IMG');
        newImage.src = event.target.result;
        newImage.className = 'photo';
        photoColumn.insertAdjacentElement('afterbegin', newImage);
        const submit = this.#drawButtons('Подтвердить', '2px', true);
        const discard = this.#drawButtons('Отменить', '2px');

        const text = document.getElementsByClassName('font font_bold font__size_middle font__color_lg')[0];
        if (text !== undefined) {
            text.hidden = true;
        }

        newImage.insertAdjacentElement('afterend', discard);
        newImage.insertAdjacentElement('afterend', submit);
        discard.addEventListener('click', (event) => {
            event.preventDefault();
            newImage.remove();
            submit.remove();
            submit.removeEventListener('click', this.#photoUploadHandler);
            discard.remove();
        });

        submit.addEventListener('click', this.#photoUploadHandler.bind(this)); // this bind is really necessary
    };

    /**
     * Get image buttons objects
     * @param {string} title - buttons title
     * @param {string} margin - margin
     * @param {boolean} first - is this button first and need 18px margin-left
     * @returns {HTMLElement} - generated button
     */
    #drawButtons = (title, margin, first = false) => {
        const button = document.createElement('BUTTON');
        button.className = 're_btn re_btn__outline drawButtonIdentifier';
        button.innerText = title;
        button.style.margin = first ? `0 ${margin} 0 18px` : margin;
        return button;
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
        };

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

    /**
     * Upload event photo to server
     * @param {Event} event
     */
    #photoUploadHandler = (event) => {
        const userPhoto = this.image.split(';')[1].split(',')[1];
        const userProfile = {
            uid: this.user.uid,
            uploaded: {img: userPhoto},
        };
        document.getElementsByClassName('drawButtonIdentifier')[1].remove();
        document.getElementsByClassName('drawButtonIdentifier')[0].remove();
        UserModel.putImage(userProfile)
            .then(response => {
                document.querySelector('.photo').src = this.image;
            }).catch(reason => console.error(reason));
    };

    // TODO: move it to view
    /**
     * Show modal window with tags settings
     * @param {Event} event
     */
    #showModalTags = (event) => {
        event.preventDefault();
        this.editView = new ModalView(document.body);
        let tags = staticTags.map((tag) => {tag.editable = true; tag.activeClass = ''; return tag;});
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
