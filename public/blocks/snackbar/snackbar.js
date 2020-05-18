import Component from 'Eventum/core/component';
import SnackbarTemplate from 'Blocks/snackbar/template.hbs';
import {detectMobile} from 'Eventum/utils/basic';

let snackbarSymbol = Symbol('snackbar component');
let snackbarEnforcer = Symbol('The only object that can create SnackBar');

export default class Snackbar extends Component {
    /**
     * State which component could be in
     * @type {'hidden' | 'active'}
     */
    state = 'hidden';

    constructor(enforcer) {
        super({});
        if (enforcer !== snackbarEnforcer) {
            throw 'Instantiation failed: use Snackbar.instance instead of new()';
        }

        this.template = SnackbarTemplate;
        this.messages = [];
        this.cssClass = 'snackbar';
        this.index = 0;
    }

    static get instance() {
        if (!this[snackbarSymbol])
            this[snackbarSymbol] = new Snackbar(snackbarEnforcer);
        return this[snackbarSymbol];
    }

    static set instance(v) {
        throw 'Can\'t change constant property!';
    }

    async addMessage(message) {
        this.messages.push(message);
        if (this.state === 'hidden') {
            this.#showSelf();
        }
    }

    async #showSelf() {
        this.state = 'active';
        this.data.body_message = this.messages.shift();
        this.data.position = detectMobile() ? 'top' : 'bottom';
        await this.render(document.body, 'beforeend');
        this.element = document.querySelector(`.${this.cssClass}`);
        this.element.addEventListener('click', this.#clickHandler);
        this.element.style.marginRight = `-${(this.element.offsetWidth / 2)}px`;
        setTimeout(() => {
            this.element.classList.remove(`${this.cssClass}_hidden`)
        }, 300);
        let index = this.index;
        setTimeout(() => {this.#hideSelf(index);}, 5000);
    }

    #hideSelf(index) {
        if (this.state === 'hidden' || index !== this.index) {
            return;
        }
        this.index++;
        this.element.classList.add(`${this.cssClass}_hidden`);
        this.element.removeEventListener('click', this.#clickHandler);
        setTimeout(() => {
            this.removeComponent(null);
            this.element = null;
            this.state = 'hidden';
            if (this.messages.length !== 0) {
                this.#showSelf();
            }
        }, 300);
    }

    #clickHandler = (event) => {
        if (event.target.matches(`.${this.cssClass}__button`)) {
            this.#hideSelf(this.index);
        }
    };
}