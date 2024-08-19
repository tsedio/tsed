import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import fs from "fs-extra";

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const packages = await findPackages(monoRepo);

  const promises = packages.map(async (pkg) => {
    if (pkg.pkg.scripts && pkg.pkg.scripts["test"]) {
      pkg.pkg.scripts["test"] = "vitest run";
      pkg.pkg.scripts["test:ci"] = "vitest run --coverage.autoUpdate=true";

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
    }
  });

  await Promise.all(promises);
}

main();
