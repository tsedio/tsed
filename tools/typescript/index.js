import {dirname, join, relative} from "node:path";

import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import fs from "fs-extra";
import globby from "globby";
import cloneDeep from "lodash/cloneDeep.js";
import get from "lodash/get.js";
import omit from "lodash/omit.js";

const scriptDir = import.meta.dirname;

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const pkgRoot = fs.readJsonSync(join(monoRepo.rootDir, "package.json"));
  const packagesRootDir = join(monoRepo.rootDir, "packages");

  const tsConfigRootPath = join(monoRepo.rootDir, "tsconfig.json");
  const tsConfigTemplate = await fs.readJson(join(scriptDir, "./tsconfig.template.json"));
  const tsConfigTemplateEsmPath = join(scriptDir, "./tsconfig.template.esm.json");
  const tsConfigTemplateSpecPath = join(scriptDir, "./tsconfig.template.spec.json");
  const tsConfigTemplateSpec = await fs.readJson(tsConfigTemplateSpecPath);
  const npmIgnoreTemplatePath = join(scriptDir, "./.npmignore.template");
  //const viteConfig = fs.readFileSync(join(scriptDir, "./vite.config.mts"), {encoding: "utf8"});

  const tsConfigRoot = await fs.readJson(tsConfigRootPath);
  tsConfigRoot.references = [];

  const packages = await findPackages(monoRepo);

  const packagesRefsMap = packages.reduce((map, pkg) => {
    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      return map.set(pkg.pkg.name, dirname(pkg.path));
    }
    return map;
  }, new Map());

  for (const pkg of packages) {
    const path = dirname(pkg.path);

    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      const tsConfig = cloneDeep(tsConfigTemplate);
      const tsConfigPath = join(path, "tsconfig.json");
      const tsConfigBuildEsmPath = join(path, "tsconfig.esm.json");
      const tsConfigBuildSpecPath = join(path, "tsconfig.spec.json");
      const npmignore = join(path, ".npmignore");
      const vitestPath = join(path, "vitest.config.mts");
      const vitePath = join(path, "vite.config.mts");

      const hasFiles = await globby(["{src,test}/**/*.spec.ts", "!node_modules"], {
        cwd: path
      });

      // const viteConfigPath = join(path, "vite.config.ts");
      tsConfig.references = [];
      const deps = new Set();

      Object.keys({
        ...(pkg.pkg.peerDependencies || {}),
        ...(pkg.pkg.devDependencies || {}),
        ...(pkg.pkg.dependencies || {})
      })
        .filter((peer) => {
          return packagesRefsMap.has(peer);
        })
        .map((peer) => {
          deps.add(peer);
          tsConfig.references.push({
            path: join(relative(dirname(pkg.path), packagesRefsMap.get(peer)), "tsconfig.json")
          });
        });

      tsConfig.references.push({
        path: "./tsconfig.esm.json"
      });

      if (hasFiles.length) {
        tsConfig.references.push({
          path: "./tsconfig.spec.json"
        });

        const paths = {};

        packages
          .filter((dep) => {
            return (
              ((dep.path.includes("/platform") && !dep.path.includes("serverless")) ||
                dep.path.includes("/components-scan") ||
                dep.path.includes("/spec") ||
                dep.path.includes("/normalize-path") ||
                dep.path.includes("/di")) &&
              !deps.has(dep.name) &&
              pkg.name !== dep.name
            );
          })
          .forEach((dep) => {
            paths["@tsed/" + dep.name] = [relative(dirname(pkg.path), dirname(dep.path)) + "/src/index.ts"];
          });
        const tsCopy = cloneDeep(tsConfigTemplateSpec);
        tsCopy.compilerOptions.paths = paths;
        tsCopy.compilerOptions.rootDir = relative(dirname(tsConfigBuildSpecPath), packagesRootDir);

        if (fs.existsSync(vitestPath)) {
          tsCopy.include.push("vitest.config.mts");
          tsCopy.compilerOptions.types = ["vite/client", "vitest/globals"];
        }

        if (fs.existsSync(vitePath)) {
          tsCopy.include.push("vite.config.mts");
        }

        await fs.writeJSON(tsConfigBuildSpecPath, tsCopy, {spaces: 2});
      }

      await fs.writeJson(tsConfigPath, tsConfig, {spaces: 2});
      await fs.copy(tsConfigTemplateEsmPath, tsConfigBuildEsmPath);
      await fs.copy(npmIgnoreTemplatePath, npmignore);

      tsConfigRoot.references.push({
        path: `./${relative(process.cwd(), path)}/tsconfig.json`
      });

      // if (hasFiles.length) {
      //   tsConfigRoot.references.push(
      //     {
      //       path: `./${relative(process.cwd(), path)}/tsconfig.spec.json`
      //     }
      //   );
      // }

      pkg.pkg = {
        name: pkg.pkg.name,
        description: pkg.pkg.description,
        type: "module",
        ...omit(pkg.pkg, ["name", "description"])
      };
      pkg.pkg.scripts = {
        ...pkg.pkg.scripts,
        "build:ts": "tsc --build tsconfig.json"
      };

      pkg.pkg.devDependencies["@tsed/typescript"] = "workspace:*";
      pkg.pkg.devDependencies["typescript"] = pkgRoot.devDependencies["typescript"];

      // migrate task
      // if (pkg.pkg.scripts["build:browser"] === "webpack") {
      //   delete pkg.pkg.devDependencies["webpack"];
      //
      //   pkg.pkg.scripts["build:browser"] = "vite build";
      //
      //   await fs.writeFile(
      //     viteConfigPath,
      //     viteConfig.replace("__PACKAGE__", pkg.pkg.name).replace("__NAME__", pkg.pkg.name.split("/")[1]),
      //     {
      //       encoding: "utf-8"
      //     }
      //   );
      // }
      //
      // if (pkg.pkg.scripts["build:browser"]) {
      //   pkg.pkg.devDependencies["vite"] = pkgRoot.devDependencies["vite"];
      // }

      // prepare exports

      // pkg.pkg.main = pkg.pkg.main.replace("cjs/", "esm/");

      pkg.pkg.type = "module";
      pkg.pkg.source = "./src/index.ts";
      pkg.pkg.main = "./lib/esm/index.js";
      pkg.pkg.module = "./lib/esm/index.js";
      pkg.pkg.typings = "./lib/types/index.d.ts";
      pkg.pkg.exports = {
        ".": omit(get(pkg, 'pkg.exports["."]', {}), ["require"])
      };

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
      try {
        fs.removeSync(join(path, "tsconfig.cjs.json"));
      } catch {}
    }
  }

  await fs.writeJson(tsConfigRootPath, tsConfigRoot, {spaces: 2});
}

main().catch((e) => {
  console.error(e);
});
