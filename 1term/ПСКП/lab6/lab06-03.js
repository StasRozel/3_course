const { send } = require('./m0603');

let from = 'rozelstas@mail.ru';
let pass = process.env.PASSWORD_MAIL;
let message = 'Hello World!';

send(from, pass, message);

