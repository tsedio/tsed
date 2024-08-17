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

      pkg.pkg.scripts["test"] = "jest --max-workers=4"
      pkg.pkg.scripts["test:ci"] = "jest --max-workers=2 && jest-coverage-thresholds-bumper"

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
    }
  });

  await Promise.all(promises);
}

main();
