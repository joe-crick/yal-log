'use strict';
var gulp = require('gulp');
var excludeGitignore = require('gulp-exclude-gitignore');
var jasmine = require('gulp-jasmine');
var xo = require('gulp-xo');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var reporters = require('jasmine-reporters');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

var handleErr = function (err) {
    console.log(err.message);
    process.exit(1);
};

gulp.task('static', function () {
    return gulp.src('lib/**/*.js')
        .pipe(excludeGitignore())
        .pipe(xo())
        .on('error', handleErr);
});

gulp.task('nsp', function (cb) {
    nsp('package.json', cb);
});

gulp.task('pre-test', function () {
    return gulp.src('lib/**/*.js').pipe(babel())

        .pipe(istanbul({includeUntested: true}))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
    var mochaErr;

    gulp.src('test/**/*.js')
        .pipe(plumber())
        .pipe(jasmine({reporter: new reporters.JUnitXmlReporter()}))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

gulp.task('babel', function () {
    return gulp.src('lib/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'test']);
