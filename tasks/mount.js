const findPackages = require('./utils/findPackages');
const { sync } = require('execa');
const logger = require('fancy-log');
const chalk = require('chalk');

module.exports = {
  packages(gulp, cb) {
    findPackages()
      .map((pkg) => {
        logger('Mount package', chalk.cyan(`'${pkg}'`));
        sync('npm', ['link', './src/' + pkg], {
          stdio: ['ignore', 'ignore', 'inherit']
        });
      });
    cb();
  }
};