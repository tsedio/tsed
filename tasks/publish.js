const findPackages = require('./utils/findPackages');
const { sync } = require('execa');
const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');

const publish = (cwd = '') => {
  try {
    const npmrc = path.join('./dist', cwd, '.npmrc');
    fs.writeFileSync(npmrc, '//registry.npmjs.org/:_authToken=${NPM_TOKEN}', {encode: 'utf8'});
    sync('npm', ['publish', '--access', 'public'], {
      cwd: './dist/' + cwd,
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (er) {
    gutil.log(gutil.colors.red(er.message), gutil.colors.red(er.stack));
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