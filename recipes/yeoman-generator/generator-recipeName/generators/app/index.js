'use strict';
// Deps
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

    prompting: function () {

        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the sensational ' + chalk.red('recipeName') + ' generator!'
        ));

        // Prompt for generator args
        var prompts = [
            {
                name: 'appname',
                message: 'Enter your project name.',
                default: 'default'
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;
            done();
        }.bind(this));

    },

    writing: {

        app: function () {

            // get generator args through 'this'
            var context = {
                appname: this.appname
            };

            // copy file using context as argument
            // this.template('_bower.json', 'bower.json', context);

            // this.fs.copyTpl(
            //     this.templatePath('src/index.html'), 
            //     this.destinationPath('src/index.html'), 
            //     context);

            // copy no arguments passed in
            // this.fs.copy(
            //     this.templatePath('src/scripts/gulp.templateCache.module.js'), 
            //     this.destinationPath('src/scripts/gulp.templateCache.module.js'));

        },

        projectfiles: function () {

            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );

        }

    },

    install: function () {
        this.installDependencies();
    }

});
