import {DMMF} from "@prisma/generator-helper";
import {Project} from "ts-morph";
import {toMap} from "@tsed/core";
import {DmmfEnum} from "../domain/DmmfEnum";
import path from "path";
import {generateDocuments} from "./generateDocuments";
import {transformEnumsToEnums} from "../transform/transformEnumsToEnums";
import {generateOutputsBarrelFile} from "./generateOutputsBarrelFile";

export function generateEnums(dmmf: DMMF.Document, project: Project, baseDirPath: string): boolean {
  const enumsMap = toMap<string, DMMF.DatamodelEnum>(dmmf.datamodel.enums, "name");
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
