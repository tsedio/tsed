import {DmmfEnum} from "../domain/DmmfEnum.js";
import {DmmfField} from "../domain/DmmfField.js";
import {DmmfModel} from "../domain/DmmfModel.js";
import {ScalarTsTypes} from "../domain/ScalarTsTypes.js";
import type {TransformContext} from "../domain/TransformContext.js";
import {isCircularRef} from "../utils/isCircularRef.js";

export function transformScalarToType(field: DmmfField, ctx: TransformContext): string {
  const {isRequired, isNullable, type, isList, location, model} = field;
  let TSType: string = type;
  const hasCircularRef = isCircularRef(field.model.name, field.type, ctx);

  switch (location) {
    case "scalar":
      TSType = ScalarTsTypes[field.type];
      break;
    case "enumTypes":
      TSType = DmmfEnum.symbolName(type);
      field.model.addImportDeclaration(`../enums/index`, DmmfEnum.symbolName(field.type));
      break;
    case "inputObjectTypes":
      TSType = DmmfModel.symbolName(type);

      if (field.model.name !== field.type) {
        field.model.addImportDeclaration(`./${DmmfModel.symbolName(field.type)}`, DmmfModel.symbolName(field.type));
      }
      break;
  }

  if (isList) {
    TSType += "[]";
  }

  if (!isList && hasCircularRef && ["inputObjectTypes", "enumTypes"].includes(location)) {
    hasCircularRef && !isList && field.model.addImportDeclaration("@tsed/core", "Relation", true);
    TSType = `Relation<${TSType}>`;
  }

  if (!isRequired) {
    if (model.isInputType) {
      TSType += " | undefined";
    } else {
      TSType += " | null";
    }
  } else if (isNullable && !isList) {
    TSType += " | null";
  }

  return TSType;
}
