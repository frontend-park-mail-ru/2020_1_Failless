export default class Component {
    data = null;
    template = null;
    cssClass = '';

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
     *
     * @type {Object<HTMLElement>}
     */
    vDOM = Object;

    constructor(data) {
        this.data = data;
    }

    get HTML() {
        return this.template(this.data);
    }

    /**
     * Do stuff before render
     */
    beforeRender() {}

    /**
     * Inserts component into place
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
        this.node = this.parent.insertAdjacentElement(where, newParent)

        this.didRender();
    }

    /**
     * Do stuff after render
     */
    didRender() {}
}