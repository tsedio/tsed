const mono = require("@tsed/monorepo-utils");
const {dirname, join, relative} = require("path");
const cloneDeep = require("lodash/cloneDeep.js");
const {readJson, writeJson, removeSync} = require("fs-extra");

const scriptDir = __dirname;

async function main() {
  const monoRepo = new mono.MonoRepo({
    rootDir: process.cwd(),
    verbose: false
  });

  const tsConfigTemplate = await readJson(join(scriptDir, "./tsconfig.template.json"));
  const tsConfigEsmTemplate = await readJson(join(scriptDir, "./tsconfig.template.esm.json"));
  const tsConfigCjsTemplate = await readJson(join(scriptDir, "./tsconfig.template.cjs.json"));

  const tsConfigRootPath = join(monoRepo.rootDir, "tsconfig.json");
  const tsConfigRoot = await readJson(tsConfigRootPath);
  tsConfigRoot.references = [];

  const packages = await mono.findPackages(monoRepo);

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
      const tsConfigCjs = cloneDeep(tsConfigCjsTemplate);
      const tsConfigCjsPath = join(path, "tsconfig.cjs.json");
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
          tsConfigCjs.references.push({
            path: relative(dirname(pkg.path), packagesRefsMap.get(peer))
          });
          tsConfigEsm.references.push({
            path: relative(dirname(pkg.path), packagesRefsMap.get(peer))
          });
        });

      await writeJson(tsConfigPath, tsConfig, {spaces: 2});
      await writeJson(tsConfigEsmPath, tsConfigEsm, {spaces: 2});
      await writeJson(tsConfigCjsPath, tsConfigCjs, {spaces: 2});

      tsConfigRoot.references.push({
        path: `./${relative(process.cwd(), path)}`
      });

      if (pkg.pkg.scripts["build:cjs"]) {
        pkg.pkg.scripts["build"] = pkg.pkg.scripts["build"].replace("yarn run build:esm && yarn run build:cjs", "yarn build:ts");
        pkg.pkg.scripts["build:ts"] = "tsc --build tsconfig.json";
        delete pkg.pkg.scripts["build:cjs"];
        delete pkg.pkg.scripts["build:esm"];
      }

      pkg.pkg.devDependencies["@tsed/typescript"] = pkg.pkg.version;

      await writeJson(pkg.path, pkg.pkg, {spaces: 2});
      try {
        removeSync(join(path, "tsconfig.compile.esm.json"));
        removeSync(join(path, "tsconfig.compile.json"));
      } catch {}
    }
  });

  await Promise.all(promises);

  await writeJson(tsConfigRootPath, tsConfigRoot, {spaces: 2});
}

main();
