const fs = require("fs-extra");
const globby = require("globby");
const normalizePath = require("normalize-path");

exports.copy = (patterns, {baseDir, outputDir}) => {
  const promises = globby.sync(patterns)
    .map(file => normalizePath(file))
    .map((file) => fs.copy(file, file.replace(baseDir, outputDir)));

  return Promise.all(promises);
};
