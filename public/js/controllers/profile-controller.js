'use strict';

import Controller from '../core/controller.js';
import ProfileView from '../views/profile-view.js';
import ProfileEditView from '../views/profile-edit-view.js';
import UserModel from '../models/user-model.js';

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
    }

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
                    const textInput = document.getElementsByClassName('btn btn_color_ok btn_size_middle')[0];
                    console.log(textInput);
                    textInput.addEventListener('click', this.#handleInfo.bind(this), false);

                    // todo: wtf???
                    // document.getElementsByClassName('btn__text btn__text_w')[1].addEventListener('click', this.#showSettingsModal.bind(this), false);
                    // document.getElementsByClassName('btn__text btn__text_w')[3].addEventListener('click', this.#hideSettingsModal.bind(this), false);
                    // document.getElementsByClassName('icon icon__add icon_size_x')[1].addEventListener('click', this.#showSetEventModal.bind(this), false);
                    // document.getElementsByClassName('btn__text btn__text_w')[5].addEventListener('click', this.#hideSetEventModal.bind(this), false);

                    const settings = document.getElementsByClassName('btn btn_color_b btn_size_middle')[0];
                    settings.addEventListener('click', this.#profileSettings.bind(this), false);

                } else {
                    // this.view.render(profile);

                    // document.getElementsByClassName('btn__text btn__text_w')[1].addEventListener('click', this._showSettingsModal.bind(this), false);
                    // document.getElementsByClassName('btn__text btn__text_w')[3].addEventListener('click', this._hideSettingsModal.bind(this), false);
                    // document.getElementsByClassName('icon icon__add icon_size_x')[1].addEventListener('click', this._showSetEventModal.bind(this), false);
                    // document.getElementsByClassName('btn__text btn__text_w')[5].addEventListener('click', this._hideSetEventModal.bind(this), false);
                    console.error('You have no rights');
                    console.log(profile);
                }
            }).catch();
    }

    #showSettingsModal = (event) => {
        document.getElementById('settings-container').style.display = 'flex';
    };

    #hideSettingsModal = (event) => {
        document.getElementById('settings-container').style.display = 'none';
    };

    #showSetEventModal = (event) => {
        document.getElementById('set-event-container').style.display = 'flex';
    };

    #hideSetEventModal = (event) => {
        document.getElementById('set-event-container').style.display = 'none';
    };

    #handleFile = (event) => {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            FR.addEventListener('load', this.#photoUploadHandler.bind(this));
            FR.readAsDataURL(event.target.files[0]);
        }
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
        this.image = event.target.result;
        const userPhoto = this.image.split(';')[1].split(',')[1];
        const userProfile = {
            name: this.user.name,
            phone: this.user.phone,
            email: this.user.email,
            password: '',
            avatar: {img: userPhoto},
            photos: [{img: userPhoto}],
            gender: this.user.gender,
            about: this.user.about,
            rating: 228.1488,
            location: {lat: 228.1488, lng: 228.1488, accuracy: 228},
            birthday: '2020-02-28T13:55:04.306347+03:00',
        };
        UserModel.putProfile(userProfile)
            .then(response =>
                document.getElementsByClassName('profile__photo_img')[0].src = this.image)
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
            case 'popupPasswd':{
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
