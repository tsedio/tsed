'use strict';
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

module.exports = {
  doc(gulp) {
    return gulp.src('./docs/_styles/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed', outFile: 'bundle.min.css' }).on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./docs/_styles/'));

  },
  docWatch(gulp) {
    gulp.watch('./docs/_styles/scss/**/*.scss', ['sass:doc']);
  }
};
