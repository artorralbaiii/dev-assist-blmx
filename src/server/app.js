'use strict';

//  Vendor Packages 
var express = require('express');
var bodyParser = require('body-parser');
var compress = require('compression');
var mongoose = require('mongoose');
var cfenv = require('cfenv');

// Application Packages
var errHandler = require('./shared/errorHandler')();

// Environment Variables
var appenv = cfenv.getAppEnv();
var config = require('./app.config')();
var envVar = appenv.isLocal ? config.env : process.env;
var port = envVar.PORT || 8001;
var environ = envVar.NODE_ENV || 'dev';

// Database Connection

mongoose.connect(envVar.MONGO_DB, { useMongoClient: true }, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database...');
    }
});

// Web Server Variables
let app = express();

// Middlewares 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(errHandler.handle);

// API Router
var api = require('./api.js')(express);
app.use('/api', api);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environ);

switch (environ) {
    case 'build':
        console.log('** BUILD ***');
        app.use(express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./bower_components/'));
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connect', function (socket) {
    global._socket = socket;
    console.log('Client is connected!');
});

// app.listen(port, () => {
//     console.log('Express server is listening on port ' + port);
//     console.log('\n ___dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
// });

server.listen(port, function () {
    console.log('Express server is listening on port ' + port);
    console.log('\n ___dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
});
