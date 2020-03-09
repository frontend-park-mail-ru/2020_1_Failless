'use strict';

import Controller from '../core/controller.js';
import ProfileView from '../views/profile-view.js';
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
        this.image = '';
        this.user = null;
    }

    action() {
        super.action();
        // todo: check is user allowed to see this
        UserModel.getProfile()
            .then((profile) => {
                if (Object.prototype.hasOwnProperty.call(profile, 'about')) {
                    this.view.render(profile);
                    this.user = profile;
                    const photoInput = document.getElementsByClassName('icon__input icon__add icon icon_size_large')[0];
                    photoInput.addEventListener('change', this._handleFile.bind(this), false);
                    const textInput = document.getElementsByClassName('btn btn_color_ok btn_size_middle')[0];
                    console.log(textInput);
                    textInput.addEventListener('click', this._handleInfo.bind(this), false);
                    document.getElementsByClassName('btn__text btn__text_w')[1].addEventListener('click', this._showSettingsModal.bind(this), false);
                    document.getElementsByClassName('btn__text btn__text_w')[3].addEventListener('click', this._hideSettingsModal.bind(this), false);
                    document.getElementsByClassName('icon icon__add icon_size_x')[1].addEventListener('click', this._showSetEventModal.bind(this), false);
                    document.getElementsByClassName('btn__text btn__text_w')[5].addEventListener('click', this._hideSetEventModal.bind(this), false);
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

    _showSettingsModal(event) {
        document.getElementById('settings-container').style.display = 'flex';
    }

    _hideSettingsModal(event) {
        document.getElementById('settings-container').style.display = 'none';
    }

    _showSetEventModal(event) {
        document.getElementById('set-event-container').style.display = 'flex';
    }

    _hideSetEventModal(event) {
        document.getElementById('set-event-container').style.display = 'none';
    }

    _handleFile(event) {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            FR.addEventListener('load', this._photoUploadHandler.bind(this));
            FR.readAsDataURL(event.target.files[0]);
        }
    }

    _handleInfo(event) {
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
        UserModel.postProfile(userProfile)
            .then(response => { console.log('ok', response); })
            .catch(reason => console.log('ERROR', reason));
    }

    _photoUploadHandler(event) {
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
        UserModel.postProfile(userProfile)
            .then(response =>
                document.getElementsByClassName('profile__photo_img')[0].src = this.image)
            .catch(reason => console.log('ERROR'));
    }
}