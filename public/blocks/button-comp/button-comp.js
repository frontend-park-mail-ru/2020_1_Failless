import Component from 'Eventum/core/component';
import ButtonTemplate from 'Blocks/button-comp/template.hbs';

export default class Button extends Component {
    /**
     * Create Button component
     * @param data {{
     *     style: String[],
     *     state: String,
     *     text: String,
     *     data_bind: String,
     * }}
     */
    constructor(data) {
        super();
        this.template = ButtonTemplate;
        this.data = data;
    }
}