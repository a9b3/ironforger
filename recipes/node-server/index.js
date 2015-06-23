;(function() {
'use strict';

require('./rootRequire.js');
var server = require('server');
var env = process.env.NODE_ENV || 'dev';
var config = rootRequire('config')[env];
var path = require('path');
var debug = require('debug')(path.basename(__dirname));

server.listen(config.port, function() {
    debug('listening on port ' + config.port);
});

}());
