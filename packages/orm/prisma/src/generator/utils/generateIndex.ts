import {Project} from "ts-morph";
import path from "path";

export function generateIndex(project: Project, baseDirPath: string, hasEnum: boolean) {
  const indexFile = path.resolve(baseDirPath, "index.ts");

  project.createSourceFile(indexFile, undefined, {overwrite: true}).addExportDeclarations(
    [
      {
        moduleSpecifier: "./client"
      },
      {
        moduleSpecifier: "./interfaces"
      },
      hasEnum && {
        moduleSpecifier: "./enums"
      },
      {
        moduleSpecifier: "./models"
      },
      {
        moduleSpecifier: "./services/PrismaService"
      },
      {
        moduleSpecifier: "./repositories"
      }
    ].filter(Boolean) as any[]
  );
}
