export default class Component {
    data = null;
    template = null;

    constructor(data) {
        this.data = data;
    }

    get HTML() {
        return this.template(this.data);
    }
}