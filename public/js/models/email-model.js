import Model from 'Eventum/core/model';
import NetworkModule from 'Eventum/core/network';
import settings from 'Settings/config';
import TextConstants from 'Eventum/utils/language/text';

export default class EmailModel extends Model {
    constructor() {
        super();
    }

    static async sendNotify(email) {
        return NetworkModule.fetchPost({path: '/construction', body: {email: email, lang: TextConstants.getCurrentLanguage()}, api: settings.email})
            .then((response) => {
                if (response.status > 499) {
                    throw new Error('Server error');
                }
                return response.json();
            })
            .catch((error) => {
                throw new Error(error);
            });
    }
}