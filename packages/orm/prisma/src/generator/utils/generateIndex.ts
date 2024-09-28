import path from "path";
import {Project} from "ts-morph";

import {resolveExtension} from "./resolveExtension.js";

export function generateIndex(project: Project, baseDirPath: string, hasEnum: boolean) {
  const indexFile = path.resolve(baseDirPath, "index.ts");

  project.createSourceFile(indexFile, undefined, {overwrite: true}).addExportDeclarations(
    [
      {
        moduleSpecifier: resolveExtension("./interfaces/index")
      },
      hasEnum && {
        moduleSpecifier: resolveExtension("./enums/index")
      },
      {
        moduleSpecifier: resolveExtension("./models/index")
      },
      {
        moduleSpecifier: resolveExtension("./services/PrismaService")
      },
      {
        moduleSpecifier: resolveExtension("./repositories/index")
      }
    ].filter(Boolean) as any[]
  );
}
