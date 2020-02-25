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

app.get('/event', function (req, res) {
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