import path from "path";
import {Project} from "ts-morph";

import {GenerateCodeOptions} from "../generateCode.js";
import {resolveExtension} from "./resolveExtension.js";

export function generateClientIndex(project: Project, baseDirPath: string, options: GenerateCodeOptions) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "client"));
  const indexFile = directory.createSourceFile("index.ts", undefined, {overwrite: true});

  const moduleSpecifier = resolveExtension(
    options.prismaClientPath.includes("@prisma/client") ? options.prismaClientPath : `../${options.prismaClientPath}/index`
  );

  indexFile.addExportDeclarations([
    {
      moduleSpecifier
    }
  ]);
}
