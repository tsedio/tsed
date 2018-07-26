const glob = require('glob');
const path = require('path');
const cwd = path.join(__dirname, '../../src');

module.exports = () => {
  const pkgs = glob.sync('*/package.json', {
    cwd
  });

  return pkgs.map((pkg) => pkg.split('/')[0]);
};