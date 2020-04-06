'use strict';

/**
 * Get string name of gender by genderId
 * @param {number} genderId
 * @returns {string}
 */
const getGender = (genderId) => {
    switch (genderId) {
    case 0:
        return 'Мужской';
    case 1:
        return 'Женский';
    default:
        return 'Другой';
    }
};

export default getGender;