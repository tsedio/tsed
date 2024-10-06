import path from "path";
import {Project, Scope} from "ts-morph";

import {resolveExtension} from "./resolveExtension.js";

export function generatePrismaService(project: Project, baseDirPath: string) {
  const directory = project.createDirectory(path.resolve(baseDirPath, "services"));
  const prismaServiceFile = directory.createSourceFile("PrismaService.ts", "", {overwrite: true});

  prismaServiceFile.addImportDeclarations([
    {
      moduleSpecifier: "@tsed/di",
      namedImports: ["Inject", "Injectable", "Configuration", "OnInit", "OnDestroy"]
    },
    {
      moduleSpecifier: "@tsed/logger",
      namedImports: ["Logger"]
    },
    {
      moduleSpecifier: resolveExtension("../client/index"),
      namedImports: ["PrismaClient"]
    }
  ]);

  const prismaService = prismaServiceFile.addClass({
    name: "PrismaService",
    isExported: true,
    decorators: [
      {
        name: "Injectable",
        arguments: []
      }
    ],
    extends: "PrismaClient",
    implements: ["OnInit", "OnDestroy"]
  });

  prismaService.addProperty({
    name: "logger",
    scope: Scope.Protected,
    type: "Logger",
    decorators: [
      {
        name: "Inject",
        arguments: []
      }
    ]
  });

  prismaService
    .addConstructor({
      parameters: [
        {
          name: "settings",
          type: "Configuration",
          decorators: [
            {
              name: "Configuration",
              arguments: []
            }
          ]
        }
      ]
    })
    .setBodyText("super(settings.get('prisma'));");

  prismaService
    .addMethod({
      name: "$onInit",
      isAsync: true,
      returnType: "Promise<void>"
    })
    .setBodyText(
      `this.logger.info("Connection to prisma database");
      await this.$connect();`
    );

  prismaService
    .addMethod({
      name: "$onDestroy",
      isAsync: true,
      returnType: "Promise<void>"
    })
    .setBodyText(
      `this.logger.info("Disconnection from prisma database");
      await this.$disconnect();`
    );

  return prismaService;
}
