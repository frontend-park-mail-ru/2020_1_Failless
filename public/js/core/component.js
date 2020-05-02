export default class Component {
    constructor(data) {
        this.data = data;
    }

    create() {

    }

    get HTML() {
        return this.template(this.data);
    }
}