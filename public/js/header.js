'use strict';

/**
 * Draw header
 * @param {HTMLElement} base
 */
export default function createHeader(base) {
    const headerItems = {
        search: 'Поиск',
        reg: 'Рега',
        login: 'Войти',
        profile: 'Профиль',
    };

    let header = document.createElement('nav');
    // let header = document.getElementsByTagName('nav');
    let logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = './logo.png';
    logo.alt = 'Eventum';
    let list = document.createElement('div');
    list.className = 'header__manage';

    Object.keys(headerItems).forEach(function (key) {
        // const headerItem = document.createElement('div');
        const headerItemLink = document.createElement('a');
        headerItemLink.className = 'header__item';
        headerItemLink.innerText = headerItems[key];
        headerItemLink.href = `/${key}`;
        headerItemLink.addEventListener('click', function (evt) {
            evt.preventDefault();
            switch (headerItems[key]) {
            case headerItems.profile:
                // createProfilePage();
                break;
            case headerItems.reg:
                // createLoginOrSignupPage(signupFields, signupData);
                break;
            case headerItems.login:
                // createLoginOrSignupPage(loginFields, loginData);
                break;
            }
        });

        // headerItem.appendChild(headerItemLink);
        list.appendChild(headerItemLink);
    });

    const application = document.getElementById('application');
    header.append(logo, list);
    header.className = 'header';
    application.insertAdjacentElement('beforeend', header);
}