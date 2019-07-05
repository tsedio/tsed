const execa = require("execa");
const fs = require("fs");
const path = require("path");
const {findIntegrationProjects} = require("./utils/findIntegrationProjects");
const {examples, projectsDir} = require("../../repo.config");

function getVersion() {
  const pkg = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf8"}));
  return pkg.version;
}

function build(project) {
  const version = getVersion();
  const cwd = path.join(projectsDir, project);
  const pkgPath = path.join(cwd, "/package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, {encoding: "utf8"}));

  Object.keys(pkg.dependencies).forEach((key) => {
    if (key.indexOf("@tsed") > -1) {
      pkg.dependencies[key] = version;
    }
  });

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: "utf8"});
}

async function publish(project) {
  if (examples[project]) {
    const version = getVersion();

    const {url} = examples[project];

    const {GH_TOKEN} = process.env;
    const repository = url.replace("https://", "");

    const cwd = path.join(projectsDir, project);

    await build(project);

    await execa.shell("git init", {cwd});

    await execa.shell("git add -A", {cwd});

    await execa.shell(`git commit -m 'Deploy project with Ts.ED v${version}'`, {
      cwd
    });

    await execa.shell(`git push -f https://${GH_TOKEN}@${repository} master:v${version}`, {cwd});
  }
}

module.exports = {
  async publish() {
    return Promise.all(findIntegrationProjects().map(publish));
  },

  async build() {
    return Promise.all(findIntegrationProjects().map(build));
  }
};

findIntegrationProjects().forEach((project) => {
  if (examples[project]) {
    module.exports[`publish:${project}`] = () => publish(project);
    module.exports[`build:${project}`] = () => build(project);
  }
});
