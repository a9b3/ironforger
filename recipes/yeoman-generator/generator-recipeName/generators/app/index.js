'use strict';
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
            var context = {
                appname: this.appname
            };

            this.template('_bower.json', 'bower.json', context);
            this.template('_package.json', 'package.json', context);
            this.template('_gulpfile.js', 'gulpfile.js', context);
            this.template('gitignore', '.gitignore', context);

            this.fs.copyTpl(
                this.templatePath('src/index.html'), 
                this.destinationPath('src/index.html'), 
                context);

            this.fs.copyTpl(
                this.templatePath('src/scripts/app.module.js'), 
                this.destinationPath('src/scripts/app.module.js'), 
                context);

            this.fs.copy(
                this.templatePath('src/scripts/gulp.templateCache.module.js'), 
                this.destinationPath('src/scripts/gulp.templateCache.module.js'));
            this.fs.copy(
                this.templatePath('src/scripts/app.controller.js'), 
                this.destinationPath('src/scripts/app.controller.js'));
            this.fs.copy(
                this.templatePath('src/scripts/app.config.js'), 
                this.destinationPath('src/scripts/app.config.js'));

            this.fs.copy(
                this.templatePath('src/scripts/shared/app.shared.module.js'), 
                this.destinationPath('src/scripts/shared/app.shared.module.js'));
            this.fs.copy(
                this.templatePath('src/scripts/components/app.components.module.js'), 
                this.destinationPath('src/scripts/components/app.components.module.js'));
            this.fs.copy(
                this.templatePath('src/scripts/views/app.views.module.js'), 
                this.destinationPath('src/scripts/views/app.views.module.js'));

            this.fs.copyTpl(
                this.templatePath('src/styles/index.scss'), 
                this.destinationPath('src/styles/index.scss'), 
                context);

            this.fs.copyTpl(
                this.templatePath('src/styles/vendor.scss'), 
                this.destinationPath('src/styles/vendor.scss'), 
                context);

            this.fs.copyTpl(
                this.templatePath('src/js/hello.js'), 
                this.destinationPath('src/js/hello.js'), 
                context);

            this.fs.copy(
                this.templatePath('src/images/hello.png'), 
                this.destinationPath('src/images/hello.png'));

            this.fs.copy(
                this.templatePath('src/vendor/vendorExample.css'), 
                this.destinationPath('src/vendor/vendorExample.css'));
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

