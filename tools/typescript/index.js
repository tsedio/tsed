import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import {dirname, join, relative} from "node:path";
import cloneDeep from "lodash/cloneDeep.js";
import omit from "lodash/omit.js";
import fs from "fs-extra";

const scriptDir = import.meta.dirname;

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const pkgRoot = fs.readJsonSync(join(monoRepo.rootDir, "package.json"));

  const tsConfigRootPath = join(monoRepo.rootDir, "tsconfig.json");
  const tsConfigTemplate = await fs.readJson(join(scriptDir, "./tsconfig.template.json"));
  const tsConfigTemplateCjsPath = join(scriptDir, "./tsconfig.template.cjs.json");
  const tsConfigTemplateEsmPath = join(scriptDir, "./tsconfig.template.esm.json");
  const tsConfigTemplateSpecPath = join(scriptDir, "./tsconfig.template.spec.json");
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

  const promises = packages.map(async (pkg) => {
    const path = dirname(pkg.path);

    if (pkg.pkg.source && pkg.pkg.source.endsWith(".ts")) {
      const tsConfig = cloneDeep(tsConfigTemplate);
      const tsConfigPath = join(path, "tsconfig.json");
      const tsConfigBuildEsmPath = join(path, "tsconfig.esm.json");
      const tsConfigBuildCjsPath = join(path, "tsconfig.cjs.json");
      const tsConfigBuildSpecPath = join(path, "tsconfig.spec.json");
      const npmignore = join(path, ".npmignore");
      // const viteConfigPath = join(path, "vite.config.ts");
      tsConfig.references = [];

      Object.keys({
        ...(pkg.pkg.peerDependencies || {}),
        ...(pkg.pkg.devDependencies || {}),
        ...(pkg.pkg.dependencies || {})
      })
        .filter((peer) => {
          return packagesRefsMap.has(peer);
        })
        .map((peer) => {
          tsConfig.references.push({
            path: join(relative(dirname(pkg.path), packagesRefsMap.get(peer)), "tsconfig.json")
          });
        });

      tsConfig.references.push(
        {
          path: "./tsconfig.cjs.json"
        },
        {
          path: "./tsconfig.esm.json"
        },
        {
          path: "./tsconfig.spec.json"
        }
      );

      await fs.writeJson(tsConfigPath, tsConfig, {spaces: 2});
      await fs.copy(tsConfigTemplateEsmPath, tsConfigBuildEsmPath);
      await fs.copy(tsConfigTemplateCjsPath, tsConfigBuildCjsPath);
      await fs.copy(tsConfigTemplateSpecPath, tsConfigBuildSpecPath);
      await fs.copy(npmIgnoreTemplatePath, npmignore);

      tsConfigRoot.references.push(
        {
          path: `./${relative(process.cwd(), path)}/tsconfig.cjs.json`
        },
        {
          path: `./${relative(process.cwd(), path)}/tsconfig.spec.json`
        }
      );

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

      pkg.pkg.main = pkg.pkg.main.replace("cjs/", "esm/");

      if (pkg.pkg.exports && !pkg.pkg.exports["."]) {
        pkg.pkg.exports = {
          ".": {
            ...pkg.pkg.exports,
            require: undefined
          }
        };
      }

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
      // try {
      //   fs.removeSync(join(path, "tsconfig.compile.esm.json"));
      //   fs.removeSync(join(path, "tsconfig.compile.json"));
      //   fs.removeSync(join(path, "tsconfig.cjs.json"));
      //   // fs.removeSync(join(path, "tsconfig.esm.json"));
      // } catch {
      // }
    }
  });

  await Promise.all(promises);

  await fs.writeJson(tsConfigRootPath, tsConfigRoot, {spaces: 2});
}

main().catch((e) => {
  console.error(e);
});
