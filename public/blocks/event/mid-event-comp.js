'use strict';

import EventComp from 'Blocks/event/event-comp';

export default class MidEvent extends EventComp {
    constructor(data, own) {
        super(data, own);
        this.type = 'mid';
    }

    incrementMembers() {
        this.data.member_amount++;
        this.amountSpan.innerText = `${this.data.member_amount}/${this.data.limit}`;
    }
}