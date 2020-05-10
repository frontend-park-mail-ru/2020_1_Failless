import Component from 'Eventum/core/component';
import EventTemplate from 'Blocks/event/template.hbs';
import {STATIC_TAGS} from 'Eventum/utils/static-data';
import settings from 'Settings/config';
import {showLoading} from 'Eventum/utils/basic';

export default class EventComp extends Component {
    fields = ['photos', 'amount', 'link'];
    cssClass = 'event';

    /**
     *
     * @type {'big' | 'mid' | 'small' | null}
     */
    type = null;

    constructor(data, own) {
        super();
        this.template = EventTemplate;
        this.data = data;
        this.data.own = own;
    }

    beforeRender() {
        super.beforeRender();
        this.prepareEventForRender();
    }

    didRender() {
        super.didRender();
        if (this.data.photos && this.data.photos.length > 0) {
            // TODO: Show loading
            showLoading(this.photosDiv);

            // Render all images
            let firstImage = document.createElement('img');
            firstImage.src = `${settings.aws}/events/${this.data.photos[0]}`;
            firstImage.style.display = 'none';
            firstImage.onload = () => {
                this.photosDiv.querySelector('.spinner').remove();              // remove spinner
                let firstImageElement = this.photosDiv.querySelector('img');    // find image
                firstImageElement.style.display = 'block';                      // show image
                let height = this.photosDiv.offsetHeight - 5;                   // get height
                firstImageElement.style.cssText = `height: ${height}px; width: auto;`;
                for (let iii = 1; iii < this.data.photos.length; iii++) {
                    let newImage = document.createElement('img');
                    newImage.src = `${settings.aws}/events/${this.data.photos[iii]}`;
                    newImage.style.cssText = `height: ${height}px; width: auto;`;
                    this.photosDiv.insertAdjacentElement('beforeend', newImage);
                }
            };
            this.photosDiv.insertAdjacentElement('afterbegin', firstImage);
        }
    }

    /**
     * Fill all necessary fields for render
     */
    prepareEventForRender() {
        if (this.data.tags) {
            this.data.tags = this.data.tags.map((tag) => {
                let newTag = {...STATIC_TAGS[tag - 1]};
                newTag.activeClass = 'tag__container_active';
                return newTag;});
        }
        this.data[this.type] = true;
        this.data.class = this.type; // basically Object.defineProperty
        if (new Date(this.data.date).getUTCFullYear() === 1) {
            this.data.date = null;
        } else {
            this.data.date = new Date(this.data.date).toLocaleString();
        }
    }

    changeLink(color, message) {
        let link = this.linkA;
        link.className = 'event__link';
        link.classList.add(`font__color_${color}`);
        link.innerText = message;
    }

    /***********************************************
                 Additional get functions
     ***********************************************/

    get photosDiv() {
        return this.vDOM['photos'];
    }

    // Mid and big events only
    get amountSpan() {
        return this.vDOM['amount'];
    }

    get linkA() {
        return this.vDOM['link'];
    }
}