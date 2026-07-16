import {DMMF} from "@prisma/generator-helper";
import {DmmfEnum} from "../domain/DmmfEnum.js";
import {Project} from "ts-morph";
import {generateDocuments} from "./generateDocuments.js";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile.js";
import path from "node:path";
import {toMap} from "@tsed/core";
import {transformEnumsToEnums} from "../transform/transformEnumsToEnums.js";

export function generateEnums(dmmf: DMMF.Document, project: Project, baseDirPath: string): boolean {
  const enumsMap = toMap<string, DMMF.DatamodelEnum>(dmmf.datamodel.enums as any, "name");
  const enums = DmmfEnum.getEnums(dmmf, enumsMap);
  const enumsDirPath = path.resolve(baseDirPath, "enums");
  const enumsDirectory = project.createDirectory(enumsDirPath);
  const enumsIndex = enumsDirectory.createSourceFile(`index.ts`, undefined, {overwrite: true});

  const exportedEnums = generateDocuments<DmmfEnum>(enums, enumsDirectory, (document) => transformEnumsToEnums(document));

  if (enums.length) {
    return !!generateOutputsBarrelFile(enumsIndex, exportedEnums);
  }

  return false;
}
