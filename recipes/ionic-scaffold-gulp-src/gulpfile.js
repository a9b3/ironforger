'use strict';

/******************************************
 *              Dependencies              *
 ******************************************/

var gulp = require('gulp')
    , $ = require('gulp-load-plugins')()
    , wiredep = require('wiredep').stream
    , del = require('del')
    , runSequence = require('run-sequence')
    , webpack = require('webpack')
    , browserSync = require('browser-sync');

var config = exports.config = {
    src: 'app',
    tmp: '.tmp',
    dist: 'www',
    errorHandler: function(name) {
        return function(e) {
            $.util.log($.util.colors.red(name + e.toString()));
            this.emit('end');
        };
    }
};

/******************************************
 *              Gulp Tasks                *
 ******************************************/

gulp.task('clean:tmp', function(done) {
    del([config.tmp]).then(function() {
        done();
    });
});

gulp.task('clean:dist', function(done) {
    del([config.dist]).then(function() {
        done();
    });
});

gulp.task('styles:tmp', function() {
    return gulp.src([
            config.src + '/**/*.css',
            config.src + '/**/*.scss',
            '!' + config.src + '/**/_*.scss'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            style: 'expanded'
        })).on('error', config.errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', config.errorHandler('Autoprefixer'))
        .pipe($.concatCss('bundle.css'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('javascript:tmp', function() {
    return gulp.src([
            config.src + '/**/*.js'
        ])
        .pipe($.angularFilesort()).on('error', config.errorHandler('AngularFilesort'))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('compiled.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream:true}));
});

// create webpack.config.js in project dir and uncomment this to use webpack instead
// also need to implement a few other gulp tasks to use webpack
// but basically webpack can replace the logic that generates the compiled js/scss/vendor files
//
// gulp.task('webpack:tmp', function(done) {
//     var compiler = require('./webpack.config.js');
//     webpack(compiler, function(e, stats) {
//         if (err) throw new $.util.PluginError('webpack', e);
//         $.util.log('[webpack]', stats.toString());
//         done();
//     });
// });

gulp.task('inject:tmp', function() {
    var sources = gulp.src([
        config.tmp + '/**/*.js',
        config.tmp + '/**/*.css'
    ], {read: false});

    var injectOpts = {
        addRootSlash: false,
        ignorePath: [config.tmp]
    };

    return gulp.src([
            config.src + '/*.html'
        ])
        .pipe($.inject(sources, injectOpts))
        .pipe(wiredep({
            directory: 'bower_components'
        }))
        .pipe(gulp.dest(config.tmp))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
    $.watch([
        config.src + '/**/*.js'
    ], function(e) {
        if (e.type === 'changed') {
            gulp.start('javascript:tmp');
        } else {
            runSequence('javascript:tmp', 'inject:tmp');
        }
    });

    $.watch([
        config.src + '/**/*.scss',
        config.src + '/**/*.css'
    ], function(e) {
        if (e.type === 'changed') {
            gulp.start('styles:tmp');
        } else {
            runSequence('styles:tmp', 'inject:tmp');
        }
    });

    $.watch([
        config.src + '/*.html',
        'bower.json'
    ], function() {
        gulp.start('inject:tmp');
    });

    $.watch([
        config.src + '/**/*.html',
        '!' + config.src + '/*.html',
    ], function() {
        browserSync.reload();
    });
});

gulp.task('server:tmp', function() {
    browserSync.init({
        server: {
            baseDir: [config.tmp, config.src],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
});

// gulp.task('server:dist', function() {
//     browserSync.init({
//         server: {
//             baseDir: [config.dist]
//         }
//     });
// });

gulp.task('dev', function() {
    runSequence(
        'clean:tmp',
        ['styles:tmp', 'javascript:tmp'],
        'inject:tmp',
        'watch',
        'server:tmp'
    );
});
