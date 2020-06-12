import Model from 'Eventum/core/model';
// import NetworkModule from 'Eventum/core/network';

export default class EmailModel extends Model {
    constructor() {
        super();
    }

    static async sendNotify(email) {
        console.log('Sending email on ', email);
        return true;
        // await NetworkModule.fetchPost();
    }
}