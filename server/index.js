'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

// app.use(cors({
// 	origin: true,
// 	credentials: true,
// }));

const users = {
  'd.dorofeev@corp.mail.ru': {
    email: 'd.dorofeev@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 3,
  },
  's.volodin@corp.mail.ru': {
    email: 'marina.titova@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 100500,
  },
  'a.ts@corp.mail.ru': {
    email: 'a.tyuldyukov@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 72,
  },
  'a.ostapenko@corp.mail.ru': {
    email: 'a.ostapenko@corp.mail.ru',
    password: 'password',
    age: 21,
    score: 72,
  },
};
const ids = {};

app.post('/signup', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  if (
      !password || !email || !age ||
      !password.match(/^\S{4,}$/) ||
      !email.match(/@/) ||
      !(typeof age === 'number' && age > 10 && age < 100)
  ) {
    return res.status(400).json({error: 'Не валидные данные пользователя'});
  }
  if (users[email]) {
    return res.status(400).json({error: 'Пользователь уже существует'});
  }

  const id = uuid();
  const user = {password, email, age, score: 0};
  ids[id] = email;
  users[email] = user;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});

  res.status(201).json({id});
});

app.post('/login', function (req, res) {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return res.status(400).json({error: 'Не указан E-Mail или пароль'});
  }
  if (!users[email] || users[email].password !== password) {
    return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
  }

  const id = uuid();
  ids[id] = email;

  res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});

  res.status(200).json({id});
});

app.get('/me', function (req, res) {
  const id = req.cookies['podvorot'];
  const email = ids[id];
  if (!email || !users[email]) {
    return res.status(401).end();
  }

  users[email].score += 1;

  res.json(users[email]);
  res.status(200).end();
});

app.get('/test/event', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type, Origin');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({hui: "ХУЙ"});

  res.status(200).end();
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Origin');
    res.append('Access-Control-Allow-Credentials', 'true');
    // intercept OPTIONS method
    console.log(req.body)
    if(req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});