'use strict';

import EventComp from 'Blocks/event/event-comp';

export default class MidEvent extends EventComp {
    constructor(data) {
        super(data);
        this.cssClass = 'event';
        this.type = 'mid';
    }
}