import {DMMF} from "@prisma/generator-helper";
import {Project} from "ts-morph";
import {toMap} from "@tsed/core";
import path from "path";
import {DmmfModel} from "../domain/DmmfModel";
import {generateDocuments} from "./generateDocuments";
import {transformModelToClass} from "../transform/transformModelToClass";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile";

export function generateModels(dmmf: DMMF.Document, project: Project, baseDirPath: string) {
  const modelsMap = toMap<string, DMMF.Model>(dmmf.datamodel.models, "name");
  const models = DmmfModel.getModels(dmmf, modelsMap);
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
