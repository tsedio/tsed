import {ModuleDeclarationKind, Project, StructureKind} from "ts-morph";
import path from "path";

export function generateInterfaces(project: Project, baseDirPath: string) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "interfaces"));
  const indexFile = directory.createSourceFile("index.ts", undefined, {overwrite: true});

  indexFile.addImportDeclaration({
    kind: StructureKind.ImportDeclaration,
    moduleSpecifier: "../client",
    namedImports: ["Prisma"]
  });

  indexFile
    .addModule({
      name: "",
      hasDeclareKeyword: true,
      declarationKind: ModuleDeclarationKind.Global
    })
    .addModule({
      name: "TsED"
    })
    .addInterface({
      name: "Configuration"
    })
    .addProperty({
      name: "prisma",
      hasQuestionToken: true,
      type: "Prisma.PrismaClientOptions"
    });
}
