const {buildApi} = require("@typedproject/ts-doc");
const execa = require("execa");
const path = require("path");
const fs = require("fs");

const {outputDir, packagesDir} = require("../../repo.config");

module.exports = {

  async buildApi() {
    const projectRoot = path.join(process.cwd(), outputDir);

    await buildApi({
      root: projectRoot,
      apiDir: path.join(process.cwd(), "docs", "api"),
      docsDir: path.join(process.cwd(), "docs"), //path.resolve(`${projectRoot}/../docs`),
      srcDir: path.join(process.cwd(), packagesDir),
      libDir: path.join(process.cwd(), outputDir),
      jsonOutputDir: path.join(process.cwd(), "docs/.vuepress/public") // path.resolve(`${projectRoot}/../docs/.vuepress/public`)
    });
  },

  async build() {
    await module.exports.buildApi();
    await execa("vuepress", ["dev", "docs"], {stdio: 'inherit'});
  },

  async serve() {
    await module.exports.buildApi();
    await execa("vuepress", ["dev", "docs"], {stdio: 'inherit'});
  },

  async publish() {
    const pkg = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf8"}));
    const {
      version,
      repository: {url}
    } = pkg;
    const {GH_TOKEN} = process.env;
    const repository = url.replace("https://", "");

    const vuePressPath = "./docs/.vuepress/dist";

    await module.exports.build();

    await execa.shell("git init", {
      cwd: vuePressPath
    });

    await execa.shell("git add -A", {
      cwd: vuePressPath
    });

    await execa.shell(`git commit -m 'Deploy documentation v${version}'`, {
      cwd: vuePressPath
    });

    await execa.shell(`git push -f https://${GH_TOKEN}@${repository} master:gh-pages`, {
      cwd: vuePressPath
    });
  }
};