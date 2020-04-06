'use strict';
import settings from 'Settings/config.js';

/**
 * Getting page url
 * @param {String} name - image name
 * @param {string} type - image type
 * @returns {string}
 */
const getPageUrl = (name = 'default.png', type = 'app') => {
    return `${settings.aws}/${type}/${name}`;
};

export default getPageUrl;
