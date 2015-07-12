;(function() {
'use strict';

var express = require('express');
var http = require('http');
var env = process.env.NODE_ENV || 'dev';
var config = rootRequire('config')[env];
var path = require('path');
var debug = require('debug')(config.debugTag + ':' + path.basename(__dirname));

/**
 * Returns a http server
 * @return {http.Server}
 */
module.exports = (function() {
    var app = express();
    var server = http.createServer(app);

    // configure app (routes etc.)
    bootstrap(app);

    return server;
}());

/**
 * Bootstraps an express app
 * @param {express.app} app
 */
function bootstrap(app) {
    var bodyParser = require('body-parser');
    var cors = require('cors');

    debug('using body parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    debug('enable cors');
    app.use(cors());

    if (env !== 'prod') {
        debug('set json response to 4 spaces');
        app.set('json spaces', 4);
    }
}

}());
