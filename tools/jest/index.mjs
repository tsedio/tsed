import {findPackages, MonoRepo} from "@tsed/monorepo-utils";
import {dirname, relative, join} from "path";
import fs from "fs-extra";

const scriptDir = import.meta.dirname;

async function main() {
  const monoRepo = new MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const tsConfigTemplate = await fs.readJson(join(scriptDir, "./tsconfig.template.json"));
  const tsConfigEsmTemplate = await fs.readJson(join(scriptDir, "./tsconfig.template.esm.json"));

  const tsConfigRootPath = join(monoRepo.rootDir, "tsconfig.json");
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
      const tsConfigEsm = cloneDeep(tsConfigEsmTemplate);
      const tsConfigEsmPath = join(path, "tsconfig.esm.json");

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
            path: relative(dirname(pkg.path), packagesRefsMap.get(peer))
          });
          tsConfigEsm.references.push({
            path: relative(dirname(pkg.path), packagesRefsMap.get(peer))
          });
        });

      await fs.writeJson(tsConfigPath, tsConfig, {spaces: 2});
      await fs.writeJson(tsConfigEsmPath, tsConfigEsm, {spaces: 2});

      tsConfigRoot.references.push({
        path: `./${relative(process.cwd(), path)}`
      });

      if (pkg.pkg.scripts["build:cjs"]) {
        pkg.pkg.scripts["build"] = pkg.pkg.scripts["build"].replace("yarn run build:esm && yarn run build:cjs", "yarn build:ts");
        delete pkg.pkg.scripts["build:cjs"];
        delete pkg.pkg.scripts["build:esm"];
      }

      pkg.pkg.scripts["build:ts"] = "tsc --build tsconfig.json && tsc --build tsconfig.esm.json";
      pkg.pkg.devDependencies["@tsed/typescript"] = pkg.pkg.version;
      if (pkg.pkg.devDependencies) {
        pkg.pkg.devDependencies["jest"] = monoRepo.rootPkg.dependencies["jest"] || monoRepo.rootPkg.devDependencies["jest"];
      }

      await fs.writeJson(pkg.path, pkg.pkg, {spaces: 2});
      try {
        fs.removeSync(join(path, "tsconfig.compile.esm.json"));
        fs.removeSync(join(path, "tsconfig.compile.json"));
        fs.removeSync(join(path, "tsconfig.cjs.json"));
      } catch {
      }
    }
  });

  await Promise.all(promises);

  await fs.writeJson(tsConfigRootPath, tsConfigRoot, {spaces: 2});
}

main();
