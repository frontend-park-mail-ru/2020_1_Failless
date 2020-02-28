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
    }

    action() {
        super.action();
        // todo: check is user allowed to see this
        this.view.render();

        const photoInput = document.getElementsByClassName('icon__input icon__add icon icon_size_x')[0];
        photoInput.addEventListener("change", this._handleFile.bind(this), false);
    }

    _handleFile(event) {
        if (event.target.files && event.target.files[0]) {
            let FR = new FileReader();
            FR.addEventListener('load', this._photoUploadHandler.bind(this));
            FR.readAsDataURL(event.target.files[0]);
          }
    }

    _photoUploadHandler(event) {
        this.image = event.target.result;
        const userPhoto = this.image.split(";")[1].split(",")[1];
        const userProfile = {
            name: 'hui',
            phone: '82282281488',
            email: 'love@mail.love',
            password: 'pass',
            avatar: {img: userPhoto},
            photos: [{img: userPhoto}],
            gender: 2,
            about: 'hui',
            rating: 228.1488,
            location: {lat: 228.1488, lng: 228.1488, accuracy: 228},
            birthday: '2020-02-28T13:55:04.306347+03:00',
        };
        UserModel.postProfile(userProfile)
            .then(response =>
                document.getElementsByClassName('profile__photo_container')[0].src = this.image
                )
            .catch(reason => console.log('ERROR'));
    }
}