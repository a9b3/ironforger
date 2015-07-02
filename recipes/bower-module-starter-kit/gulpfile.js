'use strict';

// Deps
var gulp = require('gulp');
var wiredep = require('wiredep');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

// Config
var config = {
    src: 'src',
    dist: 'dist',
    tmp: '.tmp',
    wiredep: {
        directory: 'bower_components'
    }
};

/**
 * Compiles all the files in src/ into recipeName.js and recipeName.min.js
 */
gulp.task('build', function () {
    return gulp.src(config.src + '/**/*.js')
        .pipe($.concat('recipeName.js'))
        .pipe(gulp.dest(config.dist + '/'))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.concat('recipeName.min.js'))
        .pipe(gulp.dest(config.dist + '/'))
        .pipe(browserSync.reload({stream: true}));
});

/**
 * Size of compressed min file
 */
gulp.task('library-size', function () {
    return gulp.src(config.dist + '/recipeName.min.js')
        .pipe($.size({gzip:true}));
});

/**
 * Size of src code
 */
gulp.task('module-sizes', function(){
    return gulp.src(config.src + '/**/*.js')
        .pipe($.uglify({preserveComments:'some'}))
        .pipe($.size({
            showFiles: true,
            gzip: true
        }));
});

/**
 * Compiles all sass into .tmp css files
 */
gulp.task('sass', function () {
    return gulp.src(config.src + '/**/*.scss')
        .pipe($.sass())
        .pipe(gulp.dest(config.tmp + '/'));
});

/**
 * Concats all css files into dist/recipeName.css
 */
gulp.task('buildCss', ['sass'], function () {
    return gulp.src([
            config.tmp + '/**/*.css',
            config.src + '/**/*.css'
        ])
        .pipe($.concatCss('recipeName.css'))
        .pipe($.minifyCss({keepBreaks:true}))
        .pipe(gulp.dest(config.dist + '/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('reload', function() {
    browserSync.reload();
});

/**
 * Watches for file type and calls appropriate build process on change
 */
gulp.task('watch', function () {
    gulp.watch(config.src + '/**/*.scss', ['buildCss']);
    gulp.watch(config.src + '/**/*.js', ['build']);
    gulp.watch('./**/*.html', ['reload']);
});

// shows size
gulp.task('size', ['library-size', 'module-sizes']);

// builds and watch
gulp.task('default', ['build', 'buildCss', 'watch']);

// serve this folder
gulp.task('server', function () {
    $.connect.server({port:8007});
});

// server and watch
gulp.task('serve', ['server', 'default'], function() {
    startBrowserSync('.');
});

// browser sync
function startBrowserSync(baseDir) {
    browserSync.init({
        ghostMode: false,
        server: {
            baseDir: baseDir,
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
}
