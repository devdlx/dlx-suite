
/// <reference path='typings/tsd.d.ts' />

import express = require('express');
let ParseServer = require('parse-server').ParseServer;
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import request = require('request');
let port: number = process.env.PORT || 8081;
let app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));


// Serve the Parse API on the /parse URL prefix
let api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
  // cloud: '/home/myApp/cloud/main.js', // Absolute path to your Cloud Code
  appId: 'myAppId',
  masterKey: 'myMasterKey', // Keep this key secret!
  // fileKey: 'optionalFileKey',
  serverURL: 'http://localhost:8081/api' // Don't forget to change to https if needed
});
app.use('/api', api);



//catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
  let err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err: any, req: any, res: any, next: any) => {
//     res.status(err['status'] || 500);
//     res.json('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use((err: any, req: any, res: any, next: any) => {
//   res.status(err.status || 500);
//   res.json('error', {
//     message: err.message,
//     error: {}
//   });
// });

// app.use('/app', expre ss.static(path.resolve(__dirname, 'app')));
// app.use('/libs', express.static(path.resolve(__dirname, 'libs')));
//
// let renderIndex = (req: express.Request, res: express.Response) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'));
// }
//
// app.get('/*', renderIndex);

let server = app.listen(port, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Shop-app is listening on port:' + port);
});

export = app;
