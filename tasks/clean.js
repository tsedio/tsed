const clean = require('gulp-clean');

module.exports = {
  /**
   *
   * @param gulp
   */
  dist(gulp) {
    return gulp
      .src('dist', { read: false })
      .pipe(clean());
  },
  /**
   *
   * @param gulp
   */
  workspace(gulp) {
    return gulp
      .src([
        'test/**/*.{js,js.map}',
        'src/**/*.{js,js.map}'
      ], { read: false })
      .pipe(clean());
  },
  /**
   *
   * @param gulp
   */
  api(gulp) {
    return gulp
      .src([
        'docs/api/*/*.md',
        'docs/api/*/**'
      ], { read: false })
      .pipe(clean());
  }
};