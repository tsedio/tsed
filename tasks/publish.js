const findPackages = require('./utils/findPackages');
const { sync } = require('execa');
const gutil = require('gulp-util');

const publish = (cwd = '') => {
  try {
    sync('npm', ['publish', '--access', 'public'], {
      cwd: './dist/' + cwd,
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (er) {
    gutil.warn(er);
  }
};

module.exports = {
  packages(gulp) {

    // publish core
    gutil.log('Publish package', gutil.colors.cyan(`'@tsed/core'`));
    publish('packages/core');

    // public common
    gutil.log('Publish package', gutil.colors.cyan(`'@tsed/common'`));
    publish(`packages/common`);

    findPackages()
      .filter((pkg) => ['common', 'core'].indexOf(pkg) === -1)
      .map((pkg) => {
        gutil.log('Publish package', gutil.colors.cyan(`'@tsed/${pkg}'`));
        publish(`packages/${pkg}`);
      });

    // publish legacy package
    gutil.log('Publish package', gutil.colors.cyan('ts-express-decorators'));
    publish();
  }
};