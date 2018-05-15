const findPackages = require('./utils/findPackages');
const { sync } = require('execa');
const chalk = require('chalk');
const logger = require('fancy-log');
const fs = require('fs');
const path = require('path');

const publish = (cwd = '') => {
  try {
    const npmrc = path.join('./dist', cwd, '.npmrc');
    fs.writeFileSync(npmrc, '//registry.npmjs.org/:_authToken=${NPM_TOKEN}', { encode: 'utf8' });
    sync('npm', ['publish', '--access', 'public'], {
      cwd: './dist/' + cwd,
      stdio: ['inherit', 'inherit', 'inherit']
    });
  } catch (er) {
    logger(chalk.red(er.message), chalk.red(er.stack));
  }
};

module.exports = {
  packages(gulp) {

    // publish core
    logger('Publish package', chalk.cyan(`'@tsed/core'`));
    publish('packages/core');

    // public common
    logger('Publish package', chalk.cyan(`'@tsed/common'`));
    publish(`packages/common`);

    findPackages()
      .filter((pkg) => ['common', 'core'].indexOf(pkg) === -1)
      .map((pkg) => {
        logger('Publish package', chalk.cyan(`'@tsed/${pkg}'`));
        publish(`packages/${pkg}`);
      });

    // publish legacy package
    logger('Publish package', chalk.cyan('ts-express-decorators'));
    publish();
  }
};