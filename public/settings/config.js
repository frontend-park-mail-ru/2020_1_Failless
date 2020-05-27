const DEBUG = true;
export default {
    url: DEBUG ? 'http://localhost' : 'https://eventum.xyz',
    port: DEBUG ? 8080 : 443,
    api: '/api/srv',
    chat: '/api/chats',
    img: 'img/',
    aws: 'https://eventum.s3.eu-north-1.amazonaws.com', //  app, users, events
    pageLimit: 10,
    wsurl: DEBUG ? 'ws://localhost' : 'wss://eventum.xyz',
};
