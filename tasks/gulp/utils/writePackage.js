const fs = require("fs");
exports.writePackage = (pkgPath, pkg) => {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: "utf8"});
};
