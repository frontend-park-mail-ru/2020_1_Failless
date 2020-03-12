'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

let logged = -1;

console.log(logged);

app.get('/api/event', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ test : "test"});
  res.status(200).end();
});

app.get('/api/profile', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ about : "test"});
  res.status(200).end();
});

app.post('/api/signup', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ name : "test"});

  res.status(200).end();
});

app.post('/api/signin', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ name : "test"});
  logged = 2;

  console.log(logged);

  res.status(200).end();
});

app.get('/api/profile', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ about : "test"});

  console.log(logged);

  res.status(200).end();
});

app.get('/api/logout', function (req, res) {
  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.json({ test : "test"});
  logged = -1;

  console.log(logged);

  res.status(200).end();
});

app.get('/api/getuser', function (req, res) {
  res.cookie('about', 'test');

  res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.append('Access-Control-Allow-Credentials', 'true');
  console.log(logged);
let data = {};
  if (logged===-1) {
   data = {};
}else{
     data = {
      about: 'dddddd',
      Name: "  ",
      Phone: "228",
      Email: "ilovemail@mail.com",
      Password: "  ",
      Avatar: {
        data: 228
      },
      Photos: {
        data1: 228,
        data2: 1488
      },
      Gender: 0,
      About: {
        klass: "ya"
      },
      Rating: 228.1488,
      Location: {
        dolgota: 228,
        shirota: 1488
      },
      Birthday: {
        day: 0,
        month: 0,
        year: 1488
      },
  }
}
  res.json(data);

  res.status(200).end();
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:8080');
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

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});