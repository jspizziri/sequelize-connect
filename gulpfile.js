'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

var entry = 'index.js';
var src = [entry, 'lib/**/*.js'];
var srcOption = {
  base: './'
};
var dest = './dist';


gulp.task('clean', function() {
  return gulp.src(dest, {
      read: false
    })
    .pipe(clean());
});


gulp.task('node', ['clean'], function() {
  return gulp.src(src, srcOption)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: '..'
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('default', ['node']);
