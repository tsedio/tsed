import {dirname, join} from "node:path";

import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import fs from "fs-extra";

const rootDir = import.meta.dirname;
const workspaceDir = join(rootDir, "../..");

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: workspaceDir,
    verbose: false
  });

  const packages = await findPackages(monoRepo);
  const vitestTemplate = await fs.readFile(join(rootDir, "templates/vitest.config.mts"));

  const promises = packages.map(async (pkg) => {
    if (pkg.pkg.scripts && pkg.pkg.scripts["test"]) {
      pkg.pkg.scripts["test"] = "vitest run";
      pkg.pkg.scripts["test:ci"] = "vitest run --coverage.thresholds.autoUpdate=true";
      pkg.pkg.devDependencies["vitest"] = monoRepo.rootPkg.devDependencies["vitest"];
      pkg.pkg.devDependencies["jest"] = undefined;
      pkg.pkg.devDependencies["jest-coverage-thresholds-bumper"] = undefined;

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
      await fs.writeFile(join(dirname(pkg.path), "vitest.config.mts"), vitestTemplate);

      const jestFile = join(dirname(pkg.path), "jest.config.js");

      if (fs.existsSync(jestFile)) {
        await fs.removeSync(jestFile);
      }
    }
  });

  await Promise.all(promises);
}

main();
