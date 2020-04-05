'use strict';

/**
 * Get CSRF token by key
 * @param {String} name
 * @returns {String}
 */
const getCookie = (name) => {
    console.log(document.cookie);
    if (!document.cookie) {
        return void 0;
    }
  
    const xsrfCookies = document.cookie.split(';')
        .map(c => c.trim())
        .filter(c => c.startsWith(name + '='));
  
    if (xsrfCookies.length === 0) {
        return void 0;
    }
    console.log(decodeURIComponent(xsrfCookies[0].split('=')[1]));
    console.log(decodeURIComponent(xsrfCookies[0].split('=')[0]));
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
};

export default getCookie;