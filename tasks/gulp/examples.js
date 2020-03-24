const execa = require("execa");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const logger = require("fancy-log");
const {updateVersions, writePackage, readPackage} = require("@tsed/monorepo-utils");
const {findExamplesProjects} = require("./utils/findExamplesProjects");
const {monoRepo} = require("./utils/monorepo");
const {examples, projectsDir} = require("../../repo.config");

function getVersion() {
  const pkg = JSON.parse(String(fs.readFileSync("./package.json", {encoding: "utf8"})));
  return pkg.version;
}

function setVersion(pkg, version) {
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach((key) => {
      if (key.indexOf("@tsed") > -1) {
        pkg.dependencies[key] = version;
      }
    });
  }

  return pkg;
}

async function writePackageVersion(pkgPath, version) {
  const pkg = await readPackage(pkgPath);

  await writePackage(pkgPath, setVersion(pkg, version));
}

async function updatePackage(pkgPath) {
  const currentPkg = await readPackage(pkgPath);
  const dependencies = await monoRepo.getDependencies();

  logger("Update package", chalk.cyan(pkgPath));

  currentPkg.dependencies = updateVersions(currentPkg.dependencies, dependencies, {});
  currentPkg.devDependencies = updateVersions(currentPkg.devDependencies, dependencies, {});

  await writePackage(pkgPath, currentPkg);
}

async function syncDependencies(project) {
  const cwd = path.join(projectsDir, project);
  const pkgPath = path.join(cwd, "/package.json");

  await updatePackage(pkgPath);

  const lernaProjectPath = path.join(cwd, "packages");

  if (fs.existsSync(lernaProjectPath)) {
    await updatePackage(path.join(lernaProjectPath, "server", "package.json"));
  }
}

async function build(project) {
  const version = getVersion();
  const cwd = path.join(projectsDir, project);
  const pkgPath = path.join(cwd, "/package.json");

  await updatePackage(pkgPath);

  await writePackageVersion(pkgPath, version);

  const lernaProjectPath = path.join(cwd, "packages");

  if (fs.existsSync(lernaProjectPath)) {
    await updatePackage(path.join(lernaProjectPath, "server", "package.json"));
    await writePackageVersion(path.join(lernaProjectPath, "client", "package.json"), version);
    await writePackageVersion(path.join(lernaProjectPath, "server", "package.json"), version);
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

    await execa("git", ["init"], {
      cwd,
      stdio: ["inherit"]
    });

    await execa("git", ["add", "-A"], {
      cwd,
      stdio: ["inherit"]
    });

    try {
      await execa("git", ["commit", "-m", `'Deploy project with Ts.ED v${version}'`], {
        cwd,
        stdio: ["inherit"]
      });
    } catch (er) {

    }

    await execa("git", ["push", "--set-upstream", "-f", `https://${GH_TOKEN}@${repository}`, `master:v${version}`], {
      cwd,
      stdio: ["inherit"]
    });

    await execa("git", ["push", "--set-upstream", "-f", `https://${GH_TOKEN}@${repository}`, `master:master`], {
      cwd,
      stdio: ["inherit"]
    });
  }
}

module.exports = {
  async syncDependencies() {
    return Promise.all(findExamplesProjects().map(syncDependencies));
  },

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
