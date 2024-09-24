import {DMMF} from "@prisma/generator-helper";
import {getValue, toMap} from "@tsed/core";
import path from "path";
import {Project} from "ts-morph";

import {DmmfModel} from "../domain/DmmfModel.js";
import {transformModelToClass} from "../transform/transformModelToClass.js";
import {generateDocuments} from "./generateDocuments.js";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile.js";

export function generateModels(dmmf: DMMF.Document, project: Project, baseDirPath: string) {
  const modelsMap = toMap<string, DMMF.Model>(getValue(dmmf, "datamodel.models", []), "name");
  const typesMap = toMap<string, DMMF.Model>(getValue(dmmf, "datamodel.types", []), "name");

  const models = DmmfModel.getModels(dmmf, modelsMap, typesMap);
  const modelsDirPath = path.resolve(baseDirPath, "models");
  const modelsDirectory = project.createDirectory(modelsDirPath);
  const modelsIndex = modelsDirectory.createSourceFile(`index.ts`, undefined, {overwrite: true});

  const exportedModels = generateDocuments<DmmfModel>(models, modelsDirectory, (model, sourceFile) => {
    return transformModelToClass(model, {
      dmmf,
      modelsMap
    });
  });

  generateOutputsBarrelFile(modelsIndex, exportedModels);
}
