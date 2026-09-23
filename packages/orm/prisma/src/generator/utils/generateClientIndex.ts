import {GenerateCodeOptions} from "../generateCode.js";
import {Project} from "ts-morph";
import path from "node:path";
import {resolveExtension} from "./resolveExtension.js";

export function generateClientIndex(project: Project, baseDirPath: string, options: GenerateCodeOptions) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "client"));
  const indexFile = directory.createSourceFile("index.ts", undefined, {overwrite: true});

  const prismaClientEntry = options.prismaClientEntry ?? "index";

  const moduleSpecifier = resolveExtension(
    options.prismaClientPath === "@prisma/client" ? options.prismaClientPath : `../${options.prismaClientPath}/${prismaClientEntry}`
  );

  indexFile.addExportDeclarations([
    {
      moduleSpecifier
    }
  ]);
}
