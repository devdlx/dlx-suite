'use strict';
// jshint node: true

var path = require('path');

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge-stream');
var superstatic = require('superstatic');
var plumber = require('gulp-plumber');
var inlinesource = require('gulp-inline-source');

var nodemon = require('gulp-nodemon');


// Lint JavaScript
gulp.task('jshint', function() {
    return gulp.src([
            'app/scripts/**/*.js',
            'app/elements/**/*.js',
            'app/elements/**/*.html'
        ])
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.jshint.extract()) // Extract JS from .html files
        .pipe($.jshint({
            esnext: true
        }))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({
            title: 'images'
        }));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
    var app = gulp.src([
        'app/*',
        '!app/test',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));

    var bower = gulp.src([
        'bower_components/**/*'
    ]).pipe(gulp.dest('dist/bower_components'));

    var elements = gulp.src(['app/elements/**/*.html'])
        .pipe(gulp.dest('dist/elements'));

    if (process.env.FIXTURES) {
        gulp.src(['fixtures/**/*']).pipe(gulp.dest('dist'));
    }

    return merge(app, bower, elements).pipe($.size({
        title: 'copy'
    }));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function() {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({
            title: 'fonts'
        }));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {
    return gulp.src([
            'app/styles/**/*.css'
        ])
        .pipe($.changed('styles', {
            extension: '.css'
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({
            title: 'styles'
        }));
});

gulp.task('elements', function() {
    return gulp.src([
            'app/elements/**/*.css'
        ])
        .pipe($.changed('styles', {
            extension: '.css'
        }))
        .pipe(gulp.dest('.tmp/elements'))
        .pipe(gulp.dest('dist/elements'))
        .pipe($.size({
            title: 'elements'
        }));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
    var assets = $.useref.assets({
        searchPath: ['.tmp', 'app', 'dist']
    });

    return gulp.src(['app/**/*.html', '!app/{elements,test}/**/*.html'])
        .pipe(inlinesource({
            compress: false
        }))
        // Replace path for build assets
        .pipe($.if('*.html', $.replace('elements/elements.html', 'elements/elements.build.html')))
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html'
        }));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Clean everything
gulp.task('distclean', ['clean'], del.bind(null, ['bower_components']));

// Watch Files For Changes & Reload
gulp.task('serveFFF', ['styles', 'elements', 'serve:api'], function() {


    var dirs = ['.tmp', 'app'];
    var mw = [
        function(req, res, next) {
            if (req.url.indexOf('/bower_components') !== 0) return next();
            req.url = req.url.replace(/^\/bower_components/, '');
            return superstatic({
                config: {
                    root: 'bower_components'
                }
            })(req, res, next);
        },
        superstatic({
            config: {
                root: '.tmp'
            }
        }),
        superstatic({
            config: {
                root: 'app'
            }
        })
    ];
    if (process.env.FIXTURES) mw.unshift(superstatic({
        config: {
            root: 'fixtures'
        }
    }));

    browserSync({
        notify: true,
        server: {
            baseDir: dirs,
            middleware: mw,
            port: 8000
        }
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.css'], ['styles', reload]);
    gulp.watch(['app/elements/**/*.css'], ['elements', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
});

gulp.task('serve', function(cb) {

    var started = false;

    return nodemon({
        script: './server/index.js',
        ignore: ['src/**']
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

// Build and serve the output from the dist build

gulp.task('serve:dist', ['default'], function() {
    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });


});

gulp.task('mongo', function(cb) {
    var exec = require('child_process').exec;
    var cmd = 'mongod --dbpath ' + __dirname + '/data/db';
    exec(cmd, function(error, stdout, stderr) {
        //console.log(error, stdout, stderr);
        cb();
    });


});


gulp.task('default', ['mongo', 'serve'], function(cb) {

});


// Build Production Files, the Default Task
gulp.task('defaultFFF', ['clean'], function(cb) {
    runSequence(
        ['copy', 'styles'],
        'elements', ['jshint', 'images', 'fonts', 'html'],
        cb);
});


// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
try {
    require('web-component-tester').gulp.init(gulp);
} catch (err) {}

// Load custom tasks from the `tasks` directory
try {
    require('require-dir')('tasks');
} catch (err) {}
