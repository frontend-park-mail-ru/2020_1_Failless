import EventComp from 'Blocks/event/event-comp';

export default class SmallEvent extends EventComp {
    constructor(data) {
        super(data);
        this.cssClass = 'event';
        this.type = 'small';
    }
}