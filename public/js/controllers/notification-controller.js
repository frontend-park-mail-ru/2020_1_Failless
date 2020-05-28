'use strict';
import settings from 'Settings/config';

/**
 * Notification Controller
 */
export default class NotificationController {

    constructor(path) {
        this.url = settings.wsurl;
        // TODO: create handlers for all urls and Socket creation
    }

    /**
     * Create push notification with data
     * @param {string} data
     */
    static notify = (data = 'error') => {
        if (!'Notification' in window) {
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(data);
            return;
        }

        if (Notification.permission !== 'denied') {
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === 'granted') {
                        new Notification(data);
                    }
                });
        }
    };
}