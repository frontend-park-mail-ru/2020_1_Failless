import {staticTags} from 'Eventum/utils/static-data';

function extendActiveTag(tagID) {
    let tag = staticTags[tagID - 1];
    tag.editable = true;
    tag.activeClass = 'tag__container_active';
    return tag;
}

export {extendActiveTag};
