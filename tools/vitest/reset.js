import {existsSync} from "node:fs";
import {readFile, writeFile} from "node:fs/promises";
import {dirname, join} from "node:path";

import {findPackages, MonoRepo} from "@tsed/monorepo-utils";

const rootDir = import.meta.dirname;
const workspaceDir = join(rootDir, "../..");

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: workspaceDir,
    verbose: false
  });

  const packages = await findPackages(monoRepo);

  const promises = packages.map(async (pkg) => {
    const vitestPath = join(dirname(pkg.path), "vitest.config.mts");

    if (existsSync(vitestPath)) {
      let content = await readFile(vitestPath, "utf-8");

      content = content.replace(/(statements|branches|functions|lines): (\d+)\.?(\d+)?/gi, "$1: 0");

      await writeFile(vitestPath, content, "utf-8")
        .then(() => console.log(`Reset coverage for ${pkg.name}`))
        .catch((err) => console.error(`Failed to reset coverage for ${pkg.name}:`, err));
    }
  });

  await Promise.all(promises);
}

main();
