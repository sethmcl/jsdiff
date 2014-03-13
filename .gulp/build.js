var fs      = require('fs'),
    paths   = require('./paths')(),
    replace = require('gulp-replace');

module.exports = function (gulp) {
  var helpers = fs.readFileSync(paths.helpers).toString(),
      core    = fs.readFileSync(paths.core).toString();

  gulp.task('build', ['clean', 'build:worker'], function () {
    // var worker = fs.readFileSync(paths.builtWorker)
                   // .toString()
                   // .replace(/(\r\n|\n|\r)/gm, '')
                   // .replace(/\"/gm, '\'');

    // console.log('-----', worker);

    gulp.src('./diff.js')
      .pipe(replace('//{{DIFF_HELPERS}}', helpers))
      .pipe(replace('//{{DIFF_CORE}}', core))
      // .pipe(replace('//{{DIFF_WORKER}}', worker))
      .pipe(gulp.dest('./build'));

  });

  gulp.task('build:worker', ['clean'], function () {
    return gulp.src('./lib/worker.js')
      .pipe(replace('//{{DIFF_HELPERS}}', helpers))
      .pipe(replace('//{{DIFF_CORE}}', core))
      .pipe(gulp.dest('./build'));
  });

};

