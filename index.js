#!/usr/bin/env node

// Deps
var argv = require('yargs').argv;
var ironforger = require('./src/ironforger.js');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');

// Constants
var ROOT_DIR = path.resolve(__dirname);
var RECIPES_DIR = path.resolve(ROOT_DIR, 'recipes');
var CALLEE_DIR = path.resolve('.');

function main() {
    var commands = argv._;

    if (commands.length === 0) {
        ironforger();
    } else {
        if (!isValidCommand(commands)) return;
        handlers[commands[0]](commands[1]);
    }
}

function isValidCommand(commands) {
    var allowedCommands = _.map(handlers, function(handler, key) {
        return key;
    });

    var command = commands[0];
    if (!~allowedCommands.indexOf(command)) {
        console.log(chalk.red(command, 'not supported'));
        return false;
    }

    return true;
}

var handlers = {
    save: function(arg) {
        if (!arg) {
            console.log(chalk.red('extra argument required'));
            return;
        }
        var argBasename = path.basename(arg);
        var argPath = path.resolve(CALLEE_DIR, arg);
        var recipeSymlink = path.resolve(RECIPES_DIR, argBasename);

        try {
            var lstat = fs.lstatSync(argPath);
            if (!lstat.isDirectory()) {
                console.log(chalk.red('Must provide path to dir'));
                return;
            }
        } catch (e) {
            console.log(chalk.red(argBasename, 'does not exist'));
            return;
        }

        try {
            var lstat = fs.lstatSync(recipeSymlink);
            if (lstat.isSymbolicLink()) {
                console.log(chalk.red('Link already exists'));
                return;
            }
        } catch (e) {

        }

        console.log(chalk.green('saving', argBasename, '...'));
        fs.symlinkSync(argPath, recipeSymlink);
    },
    rm: function(arg) {
        if (!arg) {
            console.log(chalk.red('extra argument required'));
            return;
        }
        var argBasename = path.basename(arg);
        var recipeSymlink = path.resolve(RECIPES_DIR, argBasename);

        try {
            var lstat = fs.lstatSync(recipeSymlink);
        } catch (e) {
            console.log(chalk.red(argBasename, 'does not exist'));
            return;
        }

        console.log(chalk.green('removing', argBasename, '...'));
        fs.unlinkSync(recipeSymlink);
    },
    ls: function() {
        console.log.apply(console, getRecipes().map(a => a + '\n'));
    },
}

/**
 * returns arr of recipe names
 */
function getRecipes() {
    var recipes = fs.readdirSync(RECIPES_DIR).filter(function(file) {
        if (/^\./.test(file)) return false;
        return file;
    });

    return recipes;
}

// Main
main();
