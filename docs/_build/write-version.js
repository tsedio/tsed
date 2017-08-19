"use strict";
const fs = require("fs");
const pkg = require("../../package.json");

module.exports = (coverpagePath) => {

  let content = fs.readFileSync(coverpagePath).toString();

  content = content.replace(/<small class="version">(.*)<\/small>/, `<small class="version">${pkg.version}<\/small>`);

  fs.writeFileSync(coverpagePath, content, {encoding: "utf8"});
};