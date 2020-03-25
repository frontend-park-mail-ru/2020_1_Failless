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
    static validateUserData = ({
                name = '',
                phone = '',
                email = '',
                password = '',
                repeatPassword = '',
            } = {}, attributes = ['email', 'password']) => {

        let error_list = [];
        error_list = attributes.map(val => {
            switch (val) {
                case 'password':
                    return !this.isNotEmpty(password) || !this.isString(password) ? ["Пустой или некорректный пароль"] : [""];
                case 'repeatPassword':
                    return !this.isNotEmpty(repeatPassword) || !this.isString(repeatPassword) ? ["Пустой или некорректный повторный пароль"] : [""];
                case 'email':
                    return !this.isNotEmpty(email) || !this.isString(email) ? ["Пустая или некорректная почта"] : [""];
                case 'phone':
                    return !this.isNotEmpty(phone) || !this.isString(phone) ? ["Пустой или некорректный телефон"] : [""];
                case 'name':
                    return !this.isNotEmpty(name) || !this.isString(name) ? ["Пустое или некорректное имя"] : [""];
            }
        });
        if (error_list.some(val => val[0] !== "")) {
            return error_list;
        } else {
            return attributes.map(val => {
                switch (val) {
                    case 'password':
                        return this.validatePassword(password);
                    case 'repeatPassword':
                        return this.validateRepeatPassword(password, repeatPassword);
                    case 'email':
                        return this.validateEmail(email);
                    case 'phone':
                        return this.validatePhone(phone);
                    case 'name':
                        return this.validateName(name);
                }
            });    
        }
    }

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
    static isNotEmpty = (input) => {
        return input !== '';
    };

    /**
     * Validate password
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validatePassword = input => {
        const errors = [];
    
        if (input.length < 8) {
            errors.push('Пароль должен содержать не менее 8 символов');
            return errors;
        }
        if (!/[0-9]/.test(input)) {
            errors.push('Пароль должен содержать цифры');
            return errors;
        }
        if (input.match(/\d+/g)) {
            if (input.match(/\d+/g).join('').length < 2) {
                errors.push('Пароль должен содержать 2 цифры');
                return errors;
            }
        }
        if (!/[A-z]/.test(input)) {
            errors.push('Пароль должен содержать латинские буквы');
            return errors;
        }
        if (!/^[\w\dA-z]+$/.test(input)) {
            errors.push('Пароль должен состоять из цифр и латинских букв');
            return errors;
        }
    
        return errors;
    }
  
    /**
     * Validate passport repeat field
     * @param {HTMLInputElement} input
     * @param {HTMLInputElement} password
     * @return {Array} array of error messages
     */
    static validateRepeatPassword = (input, password) => {
        let errors = [];

        if (input !== password) {
            errors.push('Введенное значение не совпадает с паролем');
        }

        return errors;
    }
  
    /**
     * Validate email
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validateEmail = input => {
        const errors = [];
        const emailReg = RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\' +
            '[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}' +
            '\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
        if (!emailReg.test(input)) {
            errors.push('Введите корректный email-адрес');
        }
        if (input.length > 256) {
            errors.push('Длина не должна превышать 256 символов');
        }
    
        return errors;
    }
  
    /**
     * Validate full name
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validateName = input => {
        const errors = [];
    
        if (!/^[A-ZА-ЯЁ]/.test(input)) {
            errors.push('Имя должно начинаться с заглавной буквы');
        }
        if (input.length > 32) {
            errors.push('Длина не должна превышать 32 символа');
        }

        return errors;
    }

    /**
     * Validate phone number
     * @param {HTMLInputElement} input input
     * @return {Array} array of error messages
     */
    static validatePhone = input => {
        const errors = [];

        if (input.replace(/[^0-9\.]+/g, '').length < 6) {
            errors.push('Длина не должна быть меньше 6 символов');
        }
    
        if (input.replace(/[^0-9\.]+/g, '').length > 14) {
            errors.push('Длина не должна превышать 14 символов');
        }

        return errors;
    }

}
