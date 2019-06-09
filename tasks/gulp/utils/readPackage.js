const readPackageJson = require("read-package-json");
/**
 *
 * @returns {Promise<any>}
 */
exports.readPackage = () =>
  new Promise((resolve, reject) => {
    readPackageJson("./package.json", console.error, null, (er, data) => er ? reject(er) : resolve(data));
  });
