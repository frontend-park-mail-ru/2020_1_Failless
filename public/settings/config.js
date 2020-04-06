const DEBUG = false;
const EGOR = false;
export default {
    url: DEBUG ? 'http://localhost' : 'https://eventum.rowbot.dev',
    port: EGOR ? 3001 : 3000,
    api: '/api',
    img: 'img/',
    aws: 'https://eventum.s3.eu-north-1.amazonaws.com', //  app, users, events
    pageLimit: 10,
};
