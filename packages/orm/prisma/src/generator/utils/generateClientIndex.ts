import {Project} from "ts-morph";
import path from "path";
import {GenerateCodeOptions} from "../generateCode";

export function generateClientIndex(project: Project, baseDirPath: string, options: GenerateCodeOptions) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "client"));
  const indexFile = directory.createSourceFile("index.ts", undefined, {overwrite: true});

  indexFile.addExportDeclarations([
    {moduleSpecifier: options.prismaClientPath.includes("@prisma/client") ? options.prismaClientPath : `../${options.prismaClientPath}`}
  ]);
}
