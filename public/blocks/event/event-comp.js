import Component from 'Eventum/core/component';
import EventTemplate from 'Blocks/event/template.hbs';
import {staticTags} from 'Eventum/utils/static-data';

export default class EventComp extends Component {
    /**
     *
     * @type {'big' | 'mid' | 'small' | null}
     */
    type = null;

    constructor(data) {
        super();
        this.template = EventTemplate;
        this.data = data;
    }

    beforeRender() {
        super.beforeRender();
        this.prepareEventForRender();
    }

    didRender() {
        super.didRender();
        if (this.data.photos && this.data.photos.length > 0) {
            // TODO: Show loading

            // Render all images
            console.log(this.data.photos);
        }
    }

    /**
     * Fill all necessary fields for render
     */
    prepareEventForRender() {
        if (this.data.tags) {
            this.data.tags = this.data.tags.map((tag) => {
                let newTag = staticTags[tag - 1];
                newTag.activeClass = 'tag__container_active';
                return newTag;});
        }
        this.data[this.type] = true;
        this.data.class = this.type; // basically Object.defineProperty
        this.data.date = new Date(this.data.date).toLocaleString();
    }
}