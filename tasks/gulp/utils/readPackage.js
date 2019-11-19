const readPackageJson = require("read-package-json");
/**
 *
 * @returns {Promise<any>}
 */
exports.readPackage = (path = "./package.json") =>
  new Promise((resolve, reject) => {
    const noop = () => {
    };
    readPackageJson(path, noop, null, (er, {
      readme,
      readmeFilename,
      gitHead,
      _id,
      ...data
    }) => er ? reject(er) : resolve(data));
  });
