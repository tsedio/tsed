const findPackages = require('./utils/findPackages');
const { sync } = require('execa');
const gutil = require('gulp-util');

module.exports = {
  packages(gulp) {
    findPackages()
      .map((pkg) => {
        gutil.log('Mount package', gutil.colors.cyan(`'${pkg}'`));
        sync('npm', ['link', './src/' + pkg], {
          stdio: ['ignore', 'ignore', 'inherit']
        });
      });
  }
};