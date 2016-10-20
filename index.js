// index.js
var express = require('express');
var maziDB = require('./database/connection');
maziDB = new maziDB();

var app = express();
app.use('/admin', express.static('public'));
var routes = require('./routes')(app, maziDB);
app.listen(8964);