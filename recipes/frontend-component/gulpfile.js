var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var jshint = require('gulp-jshint');
var size = require('gulp-size');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var htmlv = require('gulp-html-validator');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');

var SRC_DIR = './src/';
var DIST_DIR = './dir/';

/**
 * Compiles all the files in src/ into recipeName.js and recipeName.min.js
 * note: recipeName.main.js has to be first.
 */
gulp.task('build', function () {
    var srcFiles = [SRC_DIR + 'recipeName.main.js'];

    srcFiles.push(SRC_DIR+'*');

    util.log(srcFiles);

    return gulp.src(srcFiles)
        .pipe(concat('recipeName.js'))
        .pipe(gulp.dest(DIST_DIR))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(concat('recipeName.min.js'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('buildCss', function () {
    var srcFiles = [];

    srcFiles.push('.tempcss/*');

    return gulp.src(srcFiles)
        .pipe(concatCss('recipeName.css'))
        .pipe(minifyCss({keepBreaks:true}))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('jshint', function () {
    return gulp.src(SRC_DIR + '*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('library-size', function () {
    return gulp.src('Chart.min.js')
        .pipe(size({gzip:true}));
});

gulp.task('module-sizes', function(){
    return gulp.src(SRC_DIR + '*.js')
        .pipe(uglify({preserveComments:'some'}))
        .pipe(size({
            showFiles: true,
            gzip: true
        }))
});

gulp.task('sass', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('.tempcss'));
});

gulp.task('watch', function () {
    gulp.watch('./scss/*', ['sass', 'buildCss']);
    gulp.watch('./src/*', ['build']);
});

gulp.task('size', ['library-size', 'module-sizes']);

gulp.task('default', ['build', 'buildCss', 'watch']);

gulp.task('server', function () {
    connect.server({port:8007});
});

gulp.task('dev', ['server', 'default']);
