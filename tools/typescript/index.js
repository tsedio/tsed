import {dirname, join, relative} from "node:path";

import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import fs from "fs-extra";
import omit from "lodash/omit.js";

const scriptDir = import.meta.dirname;
const rootDir = join(scriptDir, "..", "..");

async function main() {
  const monoRepo = new MonoRepo({
    rootDir,
    verbose: false
  });

  const pkgRoot = fs.readJsonSync(join(monoRepo.rootDir, "package.json"));

  const tsConfigRootNodePath = join(monoRepo.rootDir, "tsconfig.node.json");
  const tsConfigRootSpecPath = join(monoRepo.rootDir, "tsconfig.spec.json");
  const tsConfigTemplateEsmPath = join(scriptDir, "./tsconfig.template.esm.json");

  const tsConfigRootNode = await fs.readJson(tsConfigRootNodePath);
  const tsConfigSpecNode = await fs.readJson(tsConfigRootSpecPath);
  const npmIgnoreTemplatePath = join(scriptDir, "./.npmignore.template");

  const packages = await findPackages(monoRepo);
  const paths = new Map();

  console.log("Found", packages.length, "packages...");

  for (const pkg of packages) {
    const path = dirname(pkg.path);

    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      const tsConfigBuildEsmPath = join(path, "tsconfig.esm.json");
      const npmignore = join(path, ".npmignore");
      await fs.copy(npmIgnoreTemplatePath, npmignore);

      pkg.pkg = {
        name: pkg.pkg.name,
        description: pkg.pkg.description,
        type: "module",
        ...omit(pkg.pkg, ["name", "description"])
      };

      pkg.pkg.scripts = {
        ...pkg.pkg.scripts,
        "build:ts": "tsc --build tsconfig.esm.json"
      };

      pkg.pkg.devDependencies["@tsed/typescript"] = "workspace:*";
      pkg.pkg.devDependencies["typescript"] = pkgRoot.devDependencies["typescript"];

      // await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2})
      // await fs.copy(tsConfigTemplateEsmPath, tsConfigBuildEsmPath)

      if (pkg.pkg.exports) {
        Object.entries(pkg.pkg.exports).forEach(([exportPath, exportValue]) => {
          if (exportPath === "." && exportValue["tsed-source"]) {
            paths.set(pkg.pkg.name, ["./" + relative(rootDir, join(path, exportValue["tsed-source"]))]);
          } else if (exportPath === "./**/*" && exportValue["tsed-source"]) {
            paths.set(`${pkg.pkg.name}/*`, ["./" + relative(rootDir, join(path, exportValue["tsed-source"].replace("**/*.ts", "*")))]);
          } else if (exportValue["tsed-source"]) {
            paths.set(join(pkg.pkg.name, exportPath), ["./" + relative(rootDir, join(path, exportValue["tsed-source"]))]);
          }
        });
      }
    }
  }

  tsConfigRootNode.compilerOptions["paths"] = Object.fromEntries(paths.entries());
  tsConfigSpecNode.compilerOptions["paths"] = Object.fromEntries(paths.entries());

  await fs.writeJson(tsConfigRootNodePath, tsConfigRootNode, {spaces: 2});
  await fs.writeJson(tsConfigRootSpecPath, tsConfigSpecNode, {spaces: 2});
}

main().catch((e) => {
  console.error(e);
});
