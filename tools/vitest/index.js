import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import fs from "fs-extra";
import {dirname, join} from "node:path";

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
      pkg.pkg.scripts["test:ci"] = "vitest run --coverage.autoUpdate=true";
      pkg.pkg.devDependencies["vitest"] = monoRepo.rootPkg.devDependencies["vitest"];

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
      await fs.writeFile(join(dirname(pkg.path), "vitest.config.mts"), vitestTemplate);
    }
  });

  await Promise.all(promises);
}

main();
