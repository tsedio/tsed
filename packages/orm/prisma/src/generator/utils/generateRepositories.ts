import {DMMF} from "@prisma/generator-helper";
import {toMap} from "@tsed/core";
import {camelCase, pascalCase} from "change-case";
import path from "path";
import pluralize from "pluralize";
import {ClassDeclaration, Project, Scope} from "ts-morph";

import {DmmfModel} from "../domain/DmmfModel.js";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile.js";
import {resolveExtension} from "./resolveExtension.js";

interface MethodOptions {
  repository: ClassDeclaration;
  name: string;
  model: string;
  returnType?: string | undefined;
  hasQuestionToken?: boolean;
  isAsync?: boolean;
}

function addDelegatedMethod({name, hasQuestionToken, repository, model, returnType, isAsync = true}: MethodOptions) {
  const method = repository.addMethod({
    name: name,
    isAsync,
    returnType: returnType ? `Promise<${returnType}>` : undefined,
    parameters: [
      {
        name: "args",
        type: `Prisma.${model}${pascalCase(name)}Args`,
        hasQuestionToken
      }
    ]
  });

  if (returnType) {
    method.setBodyText(`const obj = await this.collection.${name}(args);
        return this.deserialize<${returnType}>(obj);`);
  } else {
    method.setBodyText(`return this.collection.${name}(args)`);
  }
}

export function generateRepositories(dmmf: DMMF.Document, project: Project, baseDirPath: string) {
  const modelsMap = toMap<string, DMMF.Model>(dmmf.datamodel.models as any, "name");
  const models = DmmfModel.getModels(dmmf, modelsMap);
  const repoDirPath = path.resolve(baseDirPath, "repositories");
  const repoDirectory = project.createDirectory(repoDirPath);
  const repositoriesIndex = repoDirectory.createSourceFile(`index.ts`, undefined, {overwrite: true});

  const exportedModels = models.map((model) => {
    const name = pascalCase(`${pluralize(model.name)}Repository`);
    const modelName = model.toString();
    const sourceFile = repoDirectory.createSourceFile(`${name}.ts`, undefined, {overwrite: true});

    sourceFile.addImportDeclarations([
      {
        moduleSpecifier: "@tsed/core",
        namedImports: ["isArray"]
      },
      {
        moduleSpecifier: "@tsed/json-mapper",
        namedImports: ["deserialize"]
      },
      {
        moduleSpecifier: "@tsed/di",
        namedImports: ["Injectable", "Inject"]
      },
      {
        moduleSpecifier: resolveExtension("../services/PrismaService"),
        namedImports: ["PrismaService"]
      },
      {
        moduleSpecifier: resolveExtension("../client/index"),
        namedImports: ["Prisma", model.name]
      },
      {
        moduleSpecifier: resolveExtension("../models/index"),
        namedImports: [model.toString()]
      }
    ]);

    const repository = sourceFile.addClass({
      name,
      isExported: true,
      decorators: [
        {
          name: "Injectable",
          arguments: []
        }
      ]
    });

    repository.addProperty({
      name: "prisma",
      type: "PrismaService",
      scope: Scope.Protected,
      decorators: [
        {
          name: "Inject",
          arguments: []
        }
      ]
    });

    repository
      .addGetAccessor({
        name: "collection"
      })
      .setBodyText(`return this.prisma.${camelCase(model.name)}`);

    repository
      .addGetAccessor({
        name: "groupBy"
      })
      .setBodyText(`return this.collection.groupBy.bind(this.collection)`);

    repository
      .addMethod({
        name: "deserialize",
        scope: Scope.Protected,
        returnType: "T",
        parameters: [
          {
            name: "obj",
            type: `null | ${model.name} | ${model.name}[]`
          }
        ],
        typeParameters: ["T"]
      })
      .setBodyText(`return deserialize<T>(obj, {type: ${modelName}, collectionType: isArray(obj) ? Array : undefined})`);

    addDelegatedMethod({
      repository,
      name: "findUnique",
      model: model.name,
      returnType: `${modelName} | null`
    });

    addDelegatedMethod({
      repository,
      name: "findFirst",
      model: model.name,
      returnType: `${modelName} | null`
    });

    addDelegatedMethod({
      repository,
      name: "findMany",
      model: model.name,
      returnType: `${modelName}[]`,
      hasQuestionToken: true
    });

    addDelegatedMethod({
      repository,
      name: "create",
      model: model.name,
      returnType: `${modelName}`
    });

    addDelegatedMethod({
      repository,
      name: "update",
      model: model.name,
      returnType: `${modelName}`
    });

    addDelegatedMethod({
      repository,
      name: "upsert",
      model: model.name,
      returnType: `${modelName}`
    });

    addDelegatedMethod({
      repository,
      name: "delete",
      model: model.name,
      returnType: `${modelName}`
    });

    addDelegatedMethod({
      repository,
      name: "deleteMany",
      model: model.name,
      isAsync: false
    });

    addDelegatedMethod({
      repository,
      name: "updateMany",
      model: model.name,
      isAsync: false
    });

    addDelegatedMethod({
      repository,
      name: "aggregate",
      model: pascalCase(model.name),
      isAsync: false
    });

    return name;
  });

  generateOutputsBarrelFile(repositoriesIndex, exportedModels);
}
