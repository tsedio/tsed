import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import {dirname, join} from "node:path";
import fs from "fs-extra";
import {readFile} from "node:fs/promises";


const scriptDir = import.meta.dirname;

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const packages = await findPackages(monoRepo);
  const template = await readFile(join(scriptDir, "./eslint.template.js"));
  const ignore = await readFile(join(scriptDir, "./eslintignore.template"));

  const promises = packages.map(async (pkg) => {
    const path = dirname(pkg.path);

    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      await fs.writeFile(join(path, ".eslintrc.js"), template, {spaces: 2});
      await fs.writeFile(join(path, ".eslintignore"), ignore, {spaces: 2});

      pkg.pkg.scripts["lint"] = "eslint '**/*.{ts,js}'";
      pkg.pkg.scripts["lint:fix"] = "eslint '**/*.{ts,js}' --fix";

      pkg.pkg.devDependencies["@tsed/eslint"] = pkg.pkg.version;
      pkg.pkg.devDependencies["eslint"] = monoRepo.rootPkg.devDependencies["eslint"];

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
    }
  });

  await Promise.all(promises);
}

main();
