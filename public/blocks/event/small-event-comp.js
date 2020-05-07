'use strict';

import EventComp from 'Blocks/event/event-comp';

export default class SmallEvent extends EventComp {
    constructor(data, own) {
        super(data, own);
        this.type = 'small';
    }
}