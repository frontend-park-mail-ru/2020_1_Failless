'use strict';

import EventComp from 'Blocks/event/event-comp';
import TextConstants from 'Eventum/utils/language/text';

export default class MidEvent extends EventComp {
    visited = false;

    /**
     *
     * @param data {{
     *     class: 'mid',
     *     date: string,
     *     description: string,
     *     eid: Number,
     *     limit: Number,
     *     member_amount: Number,
     *     mid: boolean,
     *     own: boolean,
     *     photos: Array<String>,
     *     public: boolean,
     *     tags: Array<Number>,
     *     title: string,
     *     uid: Number
     * }}
     * @param own
     */
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
            this.changeLink('green', TextConstants.EVENT__VISITED);
        } else {
            this.decrementMembers();
            this.changeLink('black', TextConstants.EVENT__UNVISITED);
        }
    }
}