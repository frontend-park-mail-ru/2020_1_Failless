const application = document.getElementById('application');

// Initial page
const headerItems = {
    search: 'Поиск',
    reg: 'Рега',
    login: 'Войти',
    profile: 'Профиль',
};
function createHeader() {
    let header = document.getElementsByTagName('nav');
    let logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = './logo.png';
    logo.alt = 'Eventum';
    let list = document.createElement('ul');

    Object.keys(headerItems).forEach(function (key) {
        const headerItem = document.createElement('li');
        const headerItemLink = document.createElement('a');
        headerItemLink.innerText = headerItems[key];
        headerItemLink.href = `/${key}`;
        headerItemLink.addEventListener('click', function (evt) {
            evt.preventDefault();
            switch (headerItems[key]) {
                case headerItems.profile:
                    createProfilePage();
                    break;
                case headerItems.reg:
                    createLoginOrSignupPage(signupFields, signupData);
                    break;
                case headerItems.login:
                    createLoginOrSignupPage(loginFields, loginData);
                    break;
            }
        });

        headerItem.appendChild(headerItemLink);
        list.appendChild(headerItem);
    });

    header[0].append(logo, list);
}
createHeader();
// createProfilePage();

const profilePhotos = ['ProfilePhotos/1.jpg', 'ProfilePhotos/2.jpg', 'ProfilePhotos/3.jpg'];
const tags = ['#хочувБАР', '#хочувКИНО', '#хочунаКАТОК', '#хочуГУЛЯТЬ', '#хочуКУШАЦ', '#хочуСПАТЬ'];


function Event(photos, title, place, description) {
    this.photos = photos;
    this.title = title;
    this.place = place;
    this.description = description;
}

const events = [
    new Event(
        ['EventPhotos/3.jpg', 'EventPhotos/4.jpg'],
        'Концерт',
        'Москва',
        'Ну как его похвалить? Ну классный концерт, шикарный концерт, как его ещё похвалить?'),
    new Event(
        ['EventPhotos/2.jpg', 'EventPhotos/1.jpg'],
        'Выставка',
        'Ленинград',
        'Выставка Ван-Гога. Обещают привезти главный экспонат')

];

function createBlueTitle(parentDiv, text, img) {
    let centerDivHeader = document.createElement('div');
    centerDivHeader.className = 'profile-blue-title';
    let centerDivTitle = document.createElement('h3');
    centerDivTitle.innerText = text;
    centerDivHeader.appendChild(centerDivTitle);

    if (img) {
        let centerDivButton = document.createElement('img');
        centerDivButton.src = img;
        centerDivHeader.appendChild(centerDivButton)
    }

    parentDiv.append(centerDivHeader);
}

const settingsFields = {
    username:       'Егор',
    email:          'bedovegor2203@gmail.com',
    phone:          '8 (800) 555-35-35',
    oldPassword:    '',
    newPassword:    '',
    checkPassword:  '',
};

function createSettingsModal() {
    let container = document.createElement('div');
    container.id = 'settings-container';
    let settingsWindow = document.createElement('div');
    settingsWindow.className = 'settings-modal';
    let settingsForm = document.createElement('form');

    Object.keys(settingsFields).forEach(function (key) {
        let fieldName = document.createElement('h5');
        let field = document.createElement('input');
        switch (settingsFields[key]) {
            case settingsFields.username:
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', 'Username');
                field.setAttribute('readOnly', 'true');
                break;
            case settingsFields.email:
                field.setAttribute('type', 'email');
                field.setAttribute('placeholder', 'Email');
                break;
            case settingsFields.phone:
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', 'Phone');
                break;
            case settingsFields.oldPassword:
                field.setAttribute('type', 'password');
                field.setAttribute('placeholder', 'Old password');
                break;
            case settingsFields.newPassword:
                field.setAttribute('type', 'password');
                field.setAttribute('placeholder', 'New password');
                break;
            case settingsFields.checkPassword:
                field.setAttribute('type', 'password');
                field.setAttribute('placeholder', 'Repeat password');
                break;
        }
        fieldName.innerText = `${key}`;
        field.value = settingsFields[key];

        settingsForm.append(fieldName, field);
    });

    let doneButton = document.createElement('button');
    doneButton.innerText = 'Изменить';
    doneButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: do some checking
        // TODO: send data to back-end
    });
    let backButton = document.createElement('button');
    backButton.innerText = 'Назад';
    backButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        hideSettingsModal();
    });

    settingsWindow.append(settingsForm, doneButton, backButton);
    container.appendChild(settingsWindow);
    container.style.display = 'none';
    document.body.appendChild(container);
}

function createProfilePage() {
    application.innerHTML = '';

    let profileDiv = document.createElement('div');
    profileDiv.className = 'profile-page';

    let title = document.createElement('h1');
    title.innerText = 'Профиль';
    let mainDiv = document.createElement('div');
    mainDiv.className = 'profile-main';

    /// Left div
    let leftDiv = document.createElement('div');
    leftDiv.className = 'profile-field profile-left';

    createBlueTitle(leftDiv, 'О себе');

    let leftForm = document.createElement('form');

    let textArea = document.createElement('textarea');
    textArea.placeholder = 'Расскажите о себе и своих увлечениях';
    textArea.rows = 10;

    let doneButton = document.createElement('button');
    doneButton.innerText = 'Готово';
    doneButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: do some checking
        // TODO: send data to back-end
    });

    let settingsButton = document.createElement('button');
    settingsButton.innerText = 'Настройки';
    settingsButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        showSettingsModal();
    });

    leftForm.append(textArea, doneButton, settingsButton);
    leftDiv.append(leftForm);



    /// Center div
    let centerDiv = document.createElement('div');
    centerDiv.className = 'profile-field profile-center';

    createBlueTitle(centerDiv, 'Ваши фото', 'GradientButton.png');

    for (let iii = 0; iii < profilePhotos.length; iii++) {
        let photoDiv = document.createElement('div');
        photoDiv.className = 'profile-photo';
        let photo = document.createElement('img');
        photo.src = profilePhotos[iii];
        photoDiv.appendChild(photo);
        centerDiv.appendChild(photoDiv);
    }


    /// Right div
    let rightDiv = document.createElement('div');
    rightDiv.className = 'profile-field profile-right';

    createBlueTitle(rightDiv, 'Ваши тэги', 'GradientButton.png');

    // creating tag
    let tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    for (let iii = 0; iii < tags.length; iii++) {
        let tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerText = tags[iii];
        tagsDiv.appendChild(tag);
    }

    rightDiv.appendChild(tagsDiv);

    // creating events
    createBlueTitle(rightDiv, 'Ваши эвенты', 'GradientButton.png');
    let eventsDiv = document.createElement('div');
    eventsDiv.className = 'events';

    function createEvent(event, parentDiv) {
        let eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        let photos = document.createElement('div');
        photos.className = 'event-photos';
        event.photos.forEach(function(photo) {
            let img = document.createElement('img');
                img.className = 'event-photo';
                img.src = photo;
                img.alt = photo;
                photos.appendChild(img);
        });
        let title = document.createElement('h3');
        title.className = 'event-title';
        title.innerText = event.title;
        let place = document.createElement('h5');
        place.className = 'event-place';
        place.innerText = event.place;
        let description = document.createElement('p');
        description.className = 'event-description';
        description.innerText = event.description;
        eventDiv.append(photos, title, place, description);
        parentDiv.appendChild(eventDiv);
    }

    for (let iii = 0; iii < events.length; iii++) {
        createEvent(events[iii], eventsDiv);
    }
    rightDiv.appendChild(eventsDiv);


    mainDiv.append(leftDiv, centerDiv, rightDiv);
    profileDiv.append(title, mainDiv);
    application.appendChild(profileDiv);

    createSettingsModal();
}
createProfilePage();


function showSettingsModal() {
    document.getElementById('settings-container').style.display = 'flex';
}

function hideSettingsModal() {
    document.getElementById('settings-container').style.display = 'none';
}

const signupFields = {
    username:       'Егор',
    email:          'mail@mail.com',
    phone:          '8 (800) 555-35-35',
    password:       '',
    checkPassword:  '',
};

const loginFields = {
    email: '',
    password: '',
};

function AuthData(title, mainBtnText, secondTitle, secondBtnText, secondDescription, secondFunction) {
    this.mainTitle = title;
    this.mainBtnText = mainBtnText;
    this.secondTitle = secondTitle;
    this.secondBtnText = secondBtnText;
    this.secondDescription = secondDescription;
    this.secondFunction = secondFunction;
}

const loginData = new AuthData();
const signupData = new AuthData();

signupData.mainTitle = 'Регистрация';
signupData.mainBtnText = 'Зарегистрироваться';
signupData.secondTitle = 'Вход';
signupData.secondBtnText = 'Войти';
signupData.secondDescription = 'Уже зарегистрированы?<br>Войдите с существующим аккаунтом!';
signupData.secondFunction = function() {createLoginOrSignupPage(loginFields, loginData);};

loginData.mainTitle = 'Вход';
loginData.mainBtnText = 'Войти';
loginData.secondTitle = 'Регистрация';
loginData.secondBtnText = 'Зарегистрироваться';
loginData.secondDescription = 'Ещё нет аккаунта?<br>Пора его завести!';
loginData.secondFunction = function() {createLoginOrSignupPage(signupFields, signupData);};

function createLoginOrSignupPage(fields, data) {
    application.innerText = '';

    let container = document.createElement('div');
    let authMain = document.createElement('div');
    let titleMain = document.createElement('h1');
    let form = document.createElement('form');

    container.className = 'auth-container';
    authMain.className = 'auth-main';
    titleMain.innerText = data.mainTitle;

    let mainButton = document.createElement('button');
    mainButton.innerText = data.mainBtnText;
    mainButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: do some checking
        // TODO: send data to back-end
        alert('Clicked main button');
    });

    Object.keys(fields).forEach(function (key) {
        let fieldName = document.createElement('h5');
        let field = document.createElement('input');
        switch (fields[key]) {
            case fields.username:
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', `${key}`);
                break;
            case fields.email:
                field.setAttribute('type', 'email');
                field.setAttribute('placeholder', `${key}`);
                break;
            case fields.phone:
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', `${key}`);
                break;
            case fields.password:
                field.setAttribute('type', 'password');
                field.setAttribute('placeholder', '');
                break;
            case fields.checkPassword:
                field.setAttribute('type', 'password');
                field.setAttribute('placeholder', '');
                break;
        }
        fieldName.innerText = `${key}`;
        field.value = fields[key];

        form.append(fieldName, field);
    });

    let authSecond = document.createElement('div');
    authSecond.className = 'auth-second';

    let titleSecond = document.createElement('h2');
    titleSecond.innerText = data.secondTitle;
    let descriptionSecond = document.createElement('p');
    descriptionSecond.innerHTML = data.secondDescription;
    let secondButton = document.createElement('button');
    secondButton.className = 'white-button';
    secondButton.innerText = data.secondBtnText;
    secondButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        data.secondFunction();
    });

    authSecond.append(titleSecond, descriptionSecond, secondButton);
    authMain.append(titleMain, form, mainButton);
    container.append(authMain, authSecond);
    application.appendChild(container);
}

// https://www.freecodecamp.org/news/build-a-pwa-from-scratch-with-html-css-and-javascript/
// https://github.com/frontend-park-mail-ru/sample-2020/blob/lesson-2/public/main.js
// https://www.w3schools.com/css/css_form.asp
