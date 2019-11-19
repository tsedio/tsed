const rootPkg = require("../../../package");

exports.getDependencies = () => {
  const map = new Map();

  Object.entries({
    ...rootPkg.dependencies,
    ...rootPkg.devDependencies
  }).forEach(([key, value]) => {
    map.set(key, value.replace(/^\^/, ""));
  });

  return map;
};
