'use strict';

import ProfileView from 'Eventum/views/profile-view';
import UserModel from 'Eventum/models/user-model';
import ProfileEditView from 'Eventum/views/profile-edit-view';
import AddEventView from 'Eventum/views/add-event-view';
import ModalView from 'Eventum/views/modal-view';
import {staticTags} from 'Eventum/utils/static-data';
import {highlightTag} from 'Eventum/utils/tag-logic';
import {logoutRedirect} from 'Eventum/utils/user-utils';
import EventModel from 'Eventum/models/event-model';
import editTemplate from 'Blocks/edit-field/template.hbs';
import {makeEmpty} from 'Eventum/utils/basic';
import Router from 'Eventum/core/router';
import Controller from 'Eventum/core/controller';

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
        this.addEventView = null;
        EventModel.getTagList().then((tags) => {
            this.localTags = [...tags];
        }).catch((onerror) => {
            console.error(onerror);
            this.localTags = [...staticTags];
        });
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
                    EventModel.getUserSubscriptions(profile.uid).then(
                        (subscriptions) => {
                            console.log(subscriptions);
                            this.view.renderSubscriptions(subscriptions).then();
                        },
                        (error) => {
                            this.view.renderSubscriptionsError().then();
                        }
                    );
                    (async () => {this.view.leftHeaderDiv.querySelectorAll('.circle')[2].classList.add('circle_active');})();
                    this.user = profile;

                    const photoInput = document.getElementById('photoUpload');
                    this.addEventHandler(photoInput, 'change', this.#handleFile);
                    const metaInput = document.getElementsByClassName('re_btn re_btn__filled')[0];
                    this.addEventHandler(metaInput, 'click', this.#handleInfo);
                    this.addEventHandler(document.querySelector('.tags-redirect'), 'click', this.#showModalTags);
                    // TODO: i dunno how to get last item to remove kek in the future
                    const settings = document.getElementsByClassName('re_btn re_btn__outline kek')[0];
                    this.addEventHandler(settings, 'click', this.#profileSettings);
                    this.addEventHandler(document.querySelector('.profile-left__tags'), 'click', this.#removeTag);
                    this.addEventHandler(document.getElementsByClassName('re_btn re_btn__outline logout')[0], 'click', logoutRedirect);

                    this.addEventHandler(document.querySelector('#add-event-btn'), 'click', this.#createEventPopup.bind(this));
                    this.addEventHandler(document.querySelector('#add-event-link'), 'click', this.#createEventPopup.bind(this));
                    // TODO: redirect error here
                    this.addEventHandler(
                        this.view.circleHeader,
                        'click',
                        (event) => {
                            event.preventDefault();
                            let circle = null;
                            if (event.target.matches('.circle')) {
                                circle = event.target;
                            } else if (event.target.matches('#icon') || event.target.matches('path')) {
                                circle = event.target.closest('.circle');
                            } else {
                                return;
                            }
                            Router.redirectForward(circle.getAttribute('data-circle-href'));
                        },
                    );
                } else {
                    console.error('You have not got rights for this page');
                    console.log(profile);
                }
            }).catch(onerror => {
                console.error(onerror);
            });
    }

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
        const photoColumn = document.getElementsByClassName('photo-columns')[0];
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
                document.getElementsByClassName('photo')[0].src = this.image;
            }).catch(reason => console.log('ERROR'));
    };

    /**
     * Show modal window with tags settings
     * @param {Event} event
     */
    #showModalTags = (event) => {
        event.preventDefault();
        this.editView = new ModalView(document.body);

        // Rendering active tags in modal view
        let activeTags = document.body.querySelectorAll('.tag__container.tag__container_active');
        let activeTagsTitles = [];
        for (let iii = 0; iii < activeTags.length; iii++) {
            activeTagsTitles.push(activeTags[iii].firstElementChild.innerText);
        }
        this.localTags.forEach((tag) => {
            tag.editable = true;
            if (activeTagsTitles.includes(tag.name)) {
                tag.activeClass = 'tag__container_active';
            }
        });
        console.log(this.localTags);
        this.editView.render({
            title: 'Ваши теги',
            tags: this.localTags,
            last_buttons: [{title: 'ОК'}]
        });

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

        this.activeModalWindow.querySelector(
            '.modal__footer').querySelector(
            '.re_btn.re_btn__outline').addEventListener(
            'click', this.#submitTagsHandler.bind(this), false);
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
        const closeBtn = document.getElementsByClassName('profile-edit__icon')[0];
        this.addEventHandler(closeBtn, 'click', this.#removeProfileSettings);
        const table = document.getElementsByClassName('profile-edit__table')[0];
        this.addEventHandler(table, 'click', this.#drawUnfoldedLine);
    };


    /**
     * Remove profile settings popup
     * @param {Event} event
     */
    #removeProfileSettings = (event) => {
        const popup = document.getElementsByClassName('profile-edit')[0];
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

    #createEventPopup(event) {
        event.preventDefault();
        this.addEventView = new AddEventView(this.parent, this.localTags);
        this.addEventView.render();
        const closeBtn = document.getElementsByClassName('profile-edit__icon')[0];
        this.addEventHandler(closeBtn, 'click', this.#removeProfileSettings);
        document.querySelector('.btn.btn_square.btn_size_middle.btn_color_dark-blue').addEventListener('click', (event) => {
            event.preventDefault();
            const form = document.querySelector('.profile-edit__form');
            const fields = form.querySelectorAll('.edit-field__input');
            const body = {
                uid: this.user.uid,
                title: fields[0].value,
                description: fields[1].value,
                tag_id: +fields[2].value,
                date: fields[3].value,
                limit: +fields[4].value,
                // photos: form[4].photos,
            };

            EventModel.createEvent(body).then((event) => {
                console.log(event);
                this.#removeProfileSettings(null);
                this.view.drawEventCard(event);
                // TODO: draw help window 'OK'
            }).catch((onerror) => {
                console.log(onerror);
            });
        });

    }
}
