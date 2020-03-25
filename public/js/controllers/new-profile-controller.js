'use strict';

import NewProfileView from '../views/new-profile-view.js';
import MyController from './my-controller.js';
import UserModel from '../models/user-model.js';

/**
 * @class NewProfileController
 */
export default class NewProfileController extends MyController {

    /**
     * construct object of NewProfileController class
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.view = new NewProfileView(parent);
        this.editView = null;
        this.image = '';
        this.user = null;

        document.addEventListener('DOMContentLoaded', () => {
            this._highlightCircle(2);
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
                console.log(profile);
                if (!profile) {
                    console.error('Server error');
                    console.log(profile);
                    return;
                }
                if (Object.prototype.hasOwnProperty.call(profile, 'about')) {
                    this.view.render(profile);
                    this.user = profile;
                    const photoInput = document.getElementById('photoUpload');
                    photoInput.addEventListener('change', this.#handleFile.bind(this), false);
                    const textInput = document.getElementsByClassName('re_btn re_btn__filled')[0];
                    console.log(textInput);
                    textInput.addEventListener('click', this.#handleInfo.bind(this), false);
                    // TODO: i dunno how to get last item to remove kek in the future
                    const settings = document.getElementsByClassName('re_btn re_btn__outline kek')[0];
                    settings.addEventListener('click', this.#profileSettings.bind(this), false);

                } else {
                    console.error('You have no rights');
                    console.log(profile);
                }
            }).catch(onerror => {
            console.error(onerror);
        });
    }

    #handleFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            FR.addEventListener('load', this.#handleSelectImg.bind(this));
            FR.readAsDataURL(event.target.files[0]);
        }
    };

    /**
     * Preview selected image and draw manage buttons
     * @param {Event} event
     */
    #handleSelectImg = (event) => {
        console.log(event.target);
        this.image = event.target.result;
        const photoColumn = document.getElementsByClassName('photo_columns')[0];
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
            // todo: remove photo
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

    #handleInfo = (event) => {
        event.preventDefault();
        const textInput = document.getElementsByClassName('input input__text_small')[0];
        const userProfile = {
            name: this.user.name,
            phone: this.user.phone,
            email: this.user.email,
            password: '',
            avatar: {path: this.user.avatar.path},
            photos: [{path: this.user.avatar.path}],
            gender: this.user.gender,
            about: textInput.value,
            rating: 228.1488,
            location: {lat: 228.1488, lng: 228.1488, accuracy: 228},
            birthday: '2020-02-28T13:55:04.306347+03:00',
        };
        UserModel.putProfile(userProfile)
            .then(response => {
                console.log('ok', response);
            })
            .catch(reason => console.log('ERROR', reason));
    };

    #photoUploadHandler = (event) => {
        const userPhoto = this.image.split(';')[1].split(',')[1];
        const userProfile = {
            uid: this.user.uid,
            uploaded: {img: userPhoto},
        };
        UserModel.putImage(userProfile)
            .then(response =>
                document.getElementsByClassName('photo')[0].src = this.image)
            .catch(reason => console.log('ERROR'));
    };


    /**
     * Create profile settings popup
     * @param event
     */
    #profileSettings = (event) => {
        this.editView = new ProfileEditView(this.parent);
        this.editView.render(this.user);
        const closeBtn = document.getElementsByClassName('profile-edit__icon')[0];
        closeBtn.addEventListener('click', this.#removeProfileSettings.bind(this));
        const table = document.getElementsByClassName('profile-edit__table')[0];
        table.addEventListener('click', this.#drawUnfoldedLine.bind(this));
    };


    /**
     * Remove profile settings popup
     * @param event
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
        let template = Handlebars.templates['edit'];
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
