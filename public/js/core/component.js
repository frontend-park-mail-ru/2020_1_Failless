export default class Component {
    data = null;
    template = null;
    cssClass = '';
    fields = [];

    /**
     * Parent element
     * @type {HTMLElement}
     */
    parent = null;

    /**
     * Node itself
     * @type {HTMLElement}
     */
    node = null;

    /**
     * Stores references to all elements
     * @type {Object<HTMLElement>}
     */
    vDOM = {};

    constructor(data) {
        this.data = data;
    }

    get element() {
        return this.node;
    }

    set element(node) {
        this.node = node;
        this.setvDOM();
    }

    get HTML() {
        return this.template(this.data);
    }

    /**
     * Thanks to BEM it's so easy
     */
    setvDOM() {
        this.fields.forEach((field) => {
            this.vDOM[field] = this.element.querySelector(`.${this.cssClass}__${field}`)
        });
    }

    /***********************************************
                         Render
     ***********************************************/

    /**
     * Do stuff before render
     */
    beforeRender() {}

    /**
     * NOT IMPLEMENTED (forgot to setvDOM)
     *
     * Inserts component into place
     *
     * @param parent {HTMLElement}
     * @param where {'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'}
     */
    async render(parent, where) {
        this.parent = parent;
        this.beforeRender();
        parent.insertAdjacentHTML(where, this.template(this.data));
        this.didRender();
    }

    /**
     * Creates parent element with class
     * Inserts the element
     * Returns the element into this.node
     *
     * Logic behind this is following:
     *  AIM: We want to store a reference to this element in this.node
     *      If we render it via parentNode.insertAdjacentHTML
     *  we would need to query the DOM to find an element
     *  which would be quite an overload in case we insert many similar components
     *      If we render it via parentNode.insertAdjacentElement
     *  we would immediately get the reference to the element
     *  (in case of succesful insertion, of course)
     *
     * @param parent {HTMLElement}
     * @param where {'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'}
     * @param cssClass {string}
     * @return {Promise<void>}
     */
    async renderAsElement(parent, where) {
        this.parent = parent;
        this.beforeRender();

        let newParent = document.createElement('div');
        newParent.classList.add(this.cssClass);
        newParent.insertAdjacentHTML('afterbegin', this.template({...this.data, without_parent: true}))
        this.element = this.parent.insertAdjacentElement(where, newParent)

        this.didRender();
    }

    /**
     * Renders component inside given HTMLElement
     * @param bodyElement
     * @return {Promise<void>}
     */
    async renderIn(bodyElement) {
        this.beforeRender();

        bodyElement.insertAdjacentHTML('afterbegin', this.template({...this.data, without_parent: true}))
        this.element = bodyElement;

        this.didRender();
    }

    /**
     * Do stuff after render
     */
    didRender() {
        this.setvDOM();
    }

    /**
     * TODO: add removeEventHandlers here
     */
    beforeRemove() {
        this.element.style.transform = 'scale(0)';
    }

    /**
     *
     * @param mode {'smooth' | null}
     */
    removeComponent(mode) {
        this.beforeRemove();

        if (mode === 'smooth') {
            setTimeout(() => {
                this.element.remove();
                this.afterRemove();
            }, 300);
        } else {
            this.element.remove();
            this.afterRemove();
        }
    }

    afterRemove() {
        this.node = null;
    }
}