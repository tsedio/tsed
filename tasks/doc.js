const {buildApi} = require("@typedproject/ts-doc");

const path = require("path");

module.exports = () => {
  const projectRoot = path.join(process.cwd(), "dist");

  return buildApi({
    root: projectRoot,
    apiDir: path.resolve(`${projectRoot}/../docs/api`),
    docsDir: path.resolve(`${projectRoot}/../docs`),
    srcDir: path.resolve(`${projectRoot}/../src`),
    libDir: path.resolve(`${projectRoot}/lib`),
    jsonOutputDir: path.resolve(`${projectRoot}/../docs/.vuepress/public`)
  });
};