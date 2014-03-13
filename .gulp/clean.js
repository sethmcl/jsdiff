var rimraf     = require('gulp-rimraf');

module.exports = function (gulp) {

  gulp.task('clean', function () {
    return gulp.src('./build', { read: false })
      .pipe(rimraf());
  });

};

