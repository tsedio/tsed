const mono = require("@tsed/monorepo-utils");
const {dirname, join, relative} = require("path");
const cloneDeep = require("lodash/cloneDeep.js");
const {readFile, writeFile, writeJson} = require("fs-extra");

const scriptDir = __dirname;

async function main() {
  const monoRepo = new mono.MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const packages = await mono.findPackages(monoRepo);
  const template = await readFile(join(scriptDir, "./eslint.template.js"));
  const ignore = await readFile(join(scriptDir, "./eslintignore.template"));

  const promises = packages.map(async (pkg) => {
    const path = dirname(pkg.path);

    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      await writeFile(join(path, ".eslintrc.js"), template, {spaces: 2});
      await writeFile(join(path, ".eslintignore"), ignore, {spaces: 2});

      pkg.pkg.scripts["lint"] = "eslint '**/*.{ts,js}'";
      pkg.pkg.scripts["lint:fix"] = "eslint '**/*.{ts,js}' --fix";

      pkg.pkg.devDependencies["@tsed/eslint"] = pkg.pkg.version;
      pkg.pkg.devDependencies["eslint"] = monoRepo.rootPkg.devDependencies["eslint"];

      await writeJson(pkg.path, pkg.pkg, {spaces: 2});
    }
  });

  await Promise.all(promises);
}

main();
