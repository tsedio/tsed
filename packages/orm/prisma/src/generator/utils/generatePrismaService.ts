import path from "node:path";

import {Project} from "ts-morph";

import {resolveExtension} from "./resolveExtension.js";

export function generatePrismaService(project: Project, baseDirPath: string) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "services"));
  const prismaServiceFile = directory.createSourceFile("PrismaService.ts", "", {overwrite: true});

  prismaServiceFile.addImportDeclarations([
    {
      moduleSpecifier: "@tsed/di",
      namedImports: ["injectable", "constant", "logger", "OnInit", "OnDestroy"]
    },
    {
      moduleSpecifier: resolveExtension("../client/index"),
      namedImports: ["PrismaClient"]
    }
  ]);

  const prismaService = prismaServiceFile.addClass({
    name: "PrismaService",
    isExported: true,
    extends: "PrismaClient",
    implements: ["OnInit", "OnDestroy"]
  });

  prismaService.addConstructor().setBodyText("super(constant('prisma'));");

  prismaService
    .addMethod({
      name: "$onInit",
      isAsync: true,
      returnType: "Promise<void>"
    })
    .setBodyText(
      `logger().info("Connection to prisma database");
      await this.$connect();`
    );

  prismaService
    .addMethod({
      name: "$onDestroy",
      isAsync: true,
      returnType: "Promise<void>"
    })
    .setBodyText(
      `logger().info("Disconnection from prisma database");
      await this.$disconnect();`
    );

  prismaServiceFile.addStatements("injectable(PrismaService);");

  return prismaService;
}
