"use strict";
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8081;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));
var api = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/dev',
    appId: 'myAppId',
    masterKey: 'myMasterKey',
    serverURL: 'http://localhost:8081/api'
});
app.use('/api', api);
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Shop-app is listening on port:' + port);
});
module.exports = app;
