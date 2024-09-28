import {DecoratorStructure, StructureKind} from "ts-morph";

import {DmmfField} from "../domain/DmmfField.js";
import {DmmfModel} from "../domain/DmmfModel.js";
import {ScalarDecorators, ScalarJsClasses} from "../domain/ScalarTsTypes.js";
import {TransformContext} from "../domain/TransformContext.js";
import {isCircularRef} from "../utils/isCircularRef.js";

function createDecorator(name: string, args: string[]): DecoratorStructure {
  return {
    kind: StructureKind.Decorator,
    name,
    arguments: args
  };
}

export function transformFieldToDecorators(field: DmmfField, ctx: TransformContext): DecoratorStructure[] {
  const hasCircularRef = isCircularRef(field.model.name, field.type, ctx);

  const decorators: DecoratorStructure[] = [...(ScalarDecorators[field.type] || [])].map((obj) => {
    field.model.addImportDeclaration("@tsed/schema", obj.name);

    return {
      kind: StructureKind.Decorator,
      ...obj
    };
  });

  if (field.isRequired) {
    field.model.addImportDeclaration("@tsed/schema", "Required");
    decorators.push(createDecorator("Required", []));
  }

  if (field.location === "enumTypes") {
    field.model.addImportDeclaration("@tsed/schema", "Enum");
    decorators.push(createDecorator("Enum", [field.type]));
  }

  if (field.isNullable && !field.isList) {
    field.model.addImportDeclaration("@tsed/schema", "Allow");
    decorators.push(createDecorator("Allow", ["null"]));
  }

  if (field.isList && field.location !== "enumTypes") {
    let classType = ScalarJsClasses[field.type] || DmmfModel.symbolName(field.type);

    if (hasCircularRef) {
      classType = `() => ${classType}`;
    }

    field.model.addImportDeclaration("@tsed/schema", "CollectionOf");
    decorators.unshift(createDecorator("CollectionOf", [classType]));
  }

  if (field.location !== "enumTypes" && !field.isList) {
    let classType = ScalarJsClasses[field.type] || DmmfModel.symbolName(field.type);

    if (hasCircularRef) {
      classType = `() => ${classType}`;
    }

    field.model.addImportDeclaration("@tsed/schema", "Property");
    decorators.unshift(createDecorator("Property", [classType]));
  }

  field.getAdditionalDecorators().forEach((item) => {
    field.model.addImportDeclaration("@tsed/schema", item.name);
    decorators.push(createDecorator(item.name, item.arguments));
  });

  return decorators;
}
