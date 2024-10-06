import {DMMF} from "@prisma/generator-helper";
import {toMap} from "@tsed/core";
import path from "path";
import {Project} from "ts-morph";

import {DmmfEnum} from "../domain/DmmfEnum.js";
import {transformEnumsToEnums} from "../transform/transformEnumsToEnums.js";
import {generateDocuments} from "./generateDocuments.js";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile.js";

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
