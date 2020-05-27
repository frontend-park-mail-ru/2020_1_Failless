'use strict';

import TextConstants from 'Eventum/utils/language/text';

/**
 * The class implements methods for user input data validation before sending to server
 */
export default class ValidationModule {

    /**
     * Check if input is valid
     * @param {Object} input user input fields
     * @param {Array} input user input types
     * @return {Array} array of errors
     */
    static validateUserData = (input, attribute) => {
        switch (attribute) {
        case 'password':
            return this.validatePassword(input);
        case 'repeatPassword':
            return this.validateRepeatPassword(input);
        case 'email':
            return this.validateEmail(input);
        case 'phone':
            return this.validatePhone(input);
        case 'name':
            return this.validateName(input);
        }
    };

    /**
     * Validate string type
     * @param {HTMLInputElement} input input string
     * @return {Boolean}
     */
    static isString = (input) => {
        return typeof input === 'string' || input instanceof String;
    };

    /**
     * Validate empty string
     * @param {HTMLInputElement} input input
     * @return {Boolean}
     */
    static isEmpty = (input) => {
        return !input;
    };

    /**
     * Validate password
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validatePassword = (input) => {
        const errors = [];
    
        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push(TextConstants.VALID__PASS_EMPTY_OR_INVALID);
        }

        if (input.length < 8) {
            errors.push(TextConstants.VALID__PASS_SHORT);
        }
        if (!/[0-9]/.test(input)) {
            errors.push(TextConstants.VALID__PASS_NO_NUMS);
        }
        if (input.match(/\d+/g)) {
            if (input.match(/\d+/g).join('').length < 2) {
                errors.push(TextConstants.VALID__PASS_FEW_NUMS);
            }
        }
        if (!/[A-z]/.test(input)) {
            errors.push(TextConstants.VALID__PASS_NO_LATIN);
        }
        if (!/^[\w\dA-z]+$/.test(input)) {
            errors.push(TextConstants.VALID__PASS_NUMS_AND_LATIN);
        }
    
        return errors;
    };
  
    /**
     * Validate passport repeat field
     * @param {HTMLInputElement} input
     * @return {Array} array of error messages
     */
    static validateRepeatPassword = (input) => {
        let errors = [];

        if (this.isEmpty(input) || !this.isString(input)) { 
            errors.push(TextConstants.VALID__PASS_SECOND_BAD);
        }

        return errors;
    };
  
    /**
     * Validate email
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validateEmail = (input) => {
        const errors = [];
        const emailReg = RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\' +
            '[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}' +
            '\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
        const anotherEmailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push(TextConstants.VALID__EMAIL_EMPTY_OR_INVALID);
        }
        // if (!emailReg.test(input)) {
        //     errors.push('Введите корректный email-адрес (например, aaaa@aaa.aa)');
        // }
        if (anotherEmailReg.exec(input) === null) {
            errors.push(TextConstants.VALID__EMAIL_MSG);
        }
        if (input.length > 256) {
            errors.push(TextConstants.VALID__EMAIL_LONG);
        }
    
        return errors;
    };
  
    /**
     * Validate phone number
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validatePhone = (input) => {
        const errors = [];
        // +79997771234
        // const regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{6})$/;
        // 89997771234
        const regex = /^\+?([0-9]{1})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{7})$/;

        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push(TextConstants.VALID__PHONE_EMPTY_OR_INVALID);
        }

        if (input.replace(/[^0-9\.]+/g, '').length < 6) {
            errors.push(TextConstants.VALID__PHONE_SHORT);
        }

        if (input.replace(/[^0-9\.]+/g, '').length > 14) {
            errors.push(TextConstants.VALID__PHONE_LONG);
        }

        if (regex.exec(input) === null) {
            errors.push(TextConstants.VALID__PHONE_MSG);
        }

        // const regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{7})$/;
        // const str = `+381234567890`;
        // let m;

        // if ((m = regex.exec(str)) !== null) {
        //     // The result can be accessed through the `m`-variable.
        //     m.forEach((match, groupIndex) => {
        //         console.log(`Found match, group ${groupIndex}: ${match}`);
        //     });
        // }

        return errors;
    };

    /**
     * Validate full name
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validateName = (input) => {
        const errors = [];

        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push(TextConstants.VALID__NAME_EMPTY_OR_INVALID);
        }

        if (!/^[A-ZА-ЯЁ]/.test(input)) {
            errors.push(TextConstants.VALID__NAME_CAPITAL);
        }
        if (input.length > 32) {
            errors.push(TextConstants.VALID__NAME_LONG);
        }

        return errors;
    };
}
