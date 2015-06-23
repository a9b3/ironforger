'use strict';

/**
 * Sets a global function to require from root dir
 */
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};
