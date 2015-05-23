'use strict';

/**
 * Module Dependencies
 */
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs-extra');
var debug = require('debug')('ironforger:'+path.basename(path.resolve(__filename)));
var inquirer = require('inquirer');

/**
 * Constants
 */
var ROOT_DIR = path.resolve(__dirname, '../');
var RECIPES_DIR = path.resolve(ROOT_DIR, 'recipes');
var CALLEE_DIR = path.resolve('.');
var KEYWORD = 'recipeName'; // keyword to look for to replace with newName

debug('\n\tconstants:\n'
    + '\t' + 'ROOT_DIR ' + ROOT_DIR + '\n'
    + '\t' + 'RECIPES_DIR ' + RECIPES_DIR + '\n'
    + '\t' + 'CALLEE_DIR ' + CALLEE_DIR + '\n'
    + '\t' + 'KEYWORD ' + KEYWORD + '\n'
);

/**
 * Exposed function
 * Display Menu
 */
function menu() {
    inquirer.prompt(generatePrompts(), answerHandler);
}

/**
 * Generates the prompts for inquirer
 * a list of recipes
 * input for new name
 */
function generatePrompts() {
    var prompts = [];

    prompts.push({
        type: 'list',
        name: 'recipe',
        message: 'Choose a recipe.',
        choices: getRecipes()
    });

    prompts.push({
        type: 'input',
        name: 'newName',
        message: 'Enter new name.',
        default: function() {
            return 'default'
        }
    });

    return prompts;
}

/**
 * copies the chosen recipe to callee's directory
 * renames the keyword to new name
 */
function answerHandler(answer) {
    var recipeDir = path.resolve(RECIPES_DIR, answer.recipe);
    var newName = answer.newName;

    debug('answers: ', answer);
    debug('recipeDir:', recipeDir);

    copyDir(recipeDir, CALLEE_DIR);
    replace(CALLEE_DIR, newName);
}

/**
 * returns arr of recipe names
 */
function getRecipes() {
    return fs.readdirSync(RECIPES_DIR);
}

/**
 * copies source dir to target dir
 */
function copyDir(source, target) {
    debug('\n\tcopyDir()\n',
        '\tsource:', source, '\n',
        '\ttarget:', target, '\n'
    );

    fs.readdirSync(source).forEach(function(file) {
        fs.copySync(path.resolve(source, file), path.resolve(target, file));
    });
}

/**
 * replace all occurances of KEYWORD with newName
 * file name, and file content
 */
function replace(source, newName) {
    fs.readdirSync(source).forEach(function(file) {
        // replace keyword in filename with new name
        var newFile = file.replace(KEYWORD, newName);
        fs.renameSync(path.resolve(source, file), path.resolve(source, newFile));

        var stats = fs.lstatSync(path.resolve(source, newFile));
        if (stats.isFile()) {
            replaceInFile(path.resolve(source, newFile), newName);
        } else if (stats.isDirectory()) {
            replace(path.resolve(source, newFile), newName);
        }
    });
}

/**
 * replace all occurances of KEYWORD in a file with newName
 */
function replaceInFile(file, newName) {
    fs.readFile(file, 'utf8', function(e, data) {
        if (e) { throw new Error(e); }

        var regEx = new RegExp(KEYWORD, 'g');

        var modifiedFile = data.replace(regEx, newName);
        fs.writeFile(file, modifiedFile, 'utf8', function(e) {
            if (e) { throw new Error(e); }
        });
    })
}

/**
 * Expose the menu function
 */
module.exports = menu;
