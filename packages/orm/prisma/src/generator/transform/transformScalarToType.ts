import {DmmfField} from "../domain/DmmfField.js";
import {DmmfModel} from "../domain/DmmfModel.js";
import {ScalarTsTypes} from "../domain/ScalarTsTypes.js";
import {DmmfEnum} from "../domain/DmmfEnum.js";

export function transformScalarToType(field: DmmfField) {
  const {isRequired, isNullable, type, isList, location, model} = field;
  let TSType: string = type;

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
