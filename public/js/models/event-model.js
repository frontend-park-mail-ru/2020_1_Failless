import NetworkModule from '../network.js';
import Model from '../core/model.js';

export default class Event extends Model {

    static getEvent() {
        return NetworkModule.fetchGet({path: '/event'}).then((response) => {
            if (response.status > 499) {
                throw new Error('Server error');
            }
            return response.json();
        },
        (error) => {
            throw new Error(error);
        });
    }
}