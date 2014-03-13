var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    requireDir = require('require-directory');

// Load all gulp tasks, defined in .gulp directory
requireDir(module, './.gulp', null, invoke);

function invoke (err, module) {
  module(gulp);
}
