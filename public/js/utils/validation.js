'use strict';

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
            errors.push('Пустой или некорректный пароль');
        }

        if (input.length < 8) {
            errors.push('Пароль должен содержать не менее 8 символов');
        }
        if (!/[0-9]/.test(input)) {
            errors.push('Пароль должен содержать цифры');
        }
        if (input.match(/\d+/g)) {
            if (input.match(/\d+/g).join('').length < 2) {
                errors.push('Пароль должен содержать 2 цифры');
            }
        }
        if (!/[A-z]/.test(input)) {
            errors.push('Пароль должен содержать латинские буквы');
        }
        if (!/^[\w\dA-z]+$/.test(input)) {
            errors.push('Пароль должен состоять из цифр и латинских букв');
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
            errors.push('Пустой или некорректный повторный пароль');
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

        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push('Пустая или некорректная почта');
        }
        if (!emailReg.test(input)) {
            errors.push('Введите корректный email-адрес (например, aaaa@aaa.aa)');
        }
        if (input.length > 256) {
            errors.push('Длина не должна превышать 256 символов');
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

        if (this.isEmpty(input) || !this.isString(input)) {
            errors.push('Пустой или некорректный телефон');
        }

        if (input.replace(/[^0-9\.]+/g, '').length < 6) {
            errors.push('Длина не должна быть меньше 6 символов');
        }

        if (input.replace(/[^0-9\.]+/g, '').length > 14) {
            errors.push('Длина не должна превышать 14 символов');
        }

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
            errors.push('Пустое или некорректное имя');
        }

        if (!/^[A-ZА-ЯЁ]/.test(input)) {
            errors.push('Имя должно начинаться с заглавной буквы');
        }
        if (input.length > 32) {
            errors.push('Длина не должна превышать 32 символа');
        }

        return errors;
    };
}
