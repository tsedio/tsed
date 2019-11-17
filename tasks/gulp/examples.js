const execa = require("execa");
const fs = require("fs");
const path = require("path");
const {findExamplesProjects} = require("./utils/findExamplesProjects");
const {examples, projectsDir} = require("../../repo.config");

function getVersion() {
  const pkg = JSON.parse(String(fs.readFileSync("./package.json", {encoding: "utf8"})));
  return pkg.version;
}

function getPkg(pkgPath) {
  return JSON.parse(String(fs.readFileSync(pkgPath, {encoding: "utf8"})));
}

function setVersion(pkg, version) {
  Object.keys(pkg.dependencies).forEach((key) => {
    if (key.indexOf("@tsed") > -1) {
      pkg.dependencies[key] = version;
    }
  });

  return pkg;
}

function writePackage(pkgPath, pkg) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: "utf8"});
}

function writePackageVersion(pkgPath, version) {
  const pkg = getPkg(pkgPath);

  writePackage(pkgPath, setVersion(pkg, version));
}

function build(project) {
  const version = getVersion();
  const cwd = path.join(projectsDir, project);
  const pkgPath = path.join(cwd, "/package.json");

  writePackageVersion(pkgPath, version);

  const lernaProjectPath = path.join(cwd, "packages");

  if (fs.existsSync(lernaProjectPath)) {
    writePackageVersion(path.join(lernaProjectPath, "client", "package.json"), version);
    writePackageVersion(path.join(lernaProjectPath, "server", "package.json"), version);
  }
}

async function publish(project) {
  if (examples[project]) {
    const version = getVersion();

    const {url} = examples[project];

    const {GH_TOKEN} = process.env;
    const repository = url.replace("https://", "");

    const cwd = path.join(projectsDir, project);

    await build(project);

    await execa("git", ["init"], {cwd});

    await execa("git", ["add", "-A"], {cwd});

    await execa("git", ["commit", "-m", `'Deploy project with Ts.ED v${version}'`], {cwd});

    await execa("git", ["push", "-f", `https://${GH_TOKEN}@${repository} master:v${version}`], {cwd});
  }
}

module.exports = {
  async publish() {
    return Promise.all(findExamplesProjects().map(publish));
  },

  async build() {
    return Promise.all(findExamplesProjects().map(build));
  }
};

findExamplesProjects().forEach((project) => {
  if (examples[project]) {
    module.exports[`publish:${project}`] = () => publish(project);
    module.exports[`build:${project}`] = () => build(project);
  }
});
