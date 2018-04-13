const gutil = require('gulp-util');
const replace = require('gulp-replace');
const findPackages = require('./utils/findPackages');
const all = require('./utils/all');

module.exports = {
  /**
   *
   * @param gulp
   * @returns {Function | "stream".internal.Writable | NodeJS.WritableStream | NodeJS.WritableStream | void | *}
   */
  files(gulp) {
    return gulp
      .src([
        './readme.md',
        '.npmignore',
        'LICENSE'
      ], { base: '.' })
      .pipe(gulp.dest('dist'))
      .pipe(gulp.dest('dist/lib/core'))
      .pipe(gulp.dest('dist/lib/common'));
  },

  src(gulp) {
    const version = require('../package.json').version;

    return gulp
      .src([
        'src/**/*.ts'
      ], { base: '.' })
      .pipe(replace('0.0.0-PLACEHOLDER', version))
      .pipe(gulp.dest('dist'));
  },

  readme(gulp) {

    return all(
      gulp
        .src([
          'src/*/readme.md'
        ], { base: './src' })
        .pipe(gulp.dest('dist/packages')),

      gulp
        .src([
          './readme.md'
        ], { base: '.' })
        .pipe(gulp.dest('dist/packages/common'))
    );
  },

  packages(gulp) {

    const promises = [];
    const version = require('../package.json').version;

    findPackages().forEach((pkg) => {

      promises.push(new Promise((resolve, reject) => {
        gutil.log('Copy src package', gutil.colors.cyan(`'${pkg}'`));
        gulp
          .src([
            'dist/src/' + pkg + '/**/*'
          ], { base: './' + 'dist/src/' + pkg })
          .pipe(replace('0.0.0-PLACEHOLDER', version))
          .pipe(gulp.dest('dist/packages/' + pkg + '/src'))
          .on('error', reject)
          .on('end', resolve);
      }));

      promises.push(new Promise((resolve, reject) => {
        gutil.log('Copy lib package', gutil.colors.cyan(`'${pkg}'`));
        gulp
          .src(['dist/lib/' + pkg + '/**'], { base: './' + 'dist/lib/' + pkg })
          .pipe(replace('0.0.0-PLACEHOLDER', version))
          .pipe(gulp.dest('dist/packages/' + pkg + '/lib'))
          .on('error', reject)
          .on('end', resolve);
      }));

    });

    return Promise.all(promises);
  }
};