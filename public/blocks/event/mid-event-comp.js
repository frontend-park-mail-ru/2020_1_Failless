'use strict';

import EventComp from 'Blocks/event/event-comp';
import TextConstants from 'Eventum/utils/text';

export default class MidEvent extends EventComp {
    visited = false;

    constructor(data, own) {
        super(data, own);
        this.type = 'mid';
        if (!own) {
            this.visited = data.followed;
        }
    }

    incrementMembers() {
        this.data.member_amount++;
        this.amountSpan.innerText = `${this.data.member_amount}/${this.data.limit}`;
    }

    decrementMembers() {
        this.data.member_amount--;
        this.amountSpan.innerText = `${this.data.member_amount}/${this.data.limit}`;
    }

    /**
     *
     * @param visited { true | false }
     */
    set state(visited) {
        this.visited = visited;
        if (visited) {
            this.incrementMembers();
            this.changeLink('green', TextConstants.EVENT_VISITED);
        } else {
            this.decrementMembers();
            this.changeLink('black', TextConstants.EVENT_UNVISITED);
        }
    }
}