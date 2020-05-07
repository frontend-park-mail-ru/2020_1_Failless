'use strict';

import EventComp from 'Blocks/event/event-comp';

export default class MidEvent extends EventComp {
    constructor(data, own) {
        super(data, own);
        this.type = 'mid';
    }
}