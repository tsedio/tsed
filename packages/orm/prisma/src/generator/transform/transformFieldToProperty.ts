import {PropertyDeclarationStructure, StructureKind} from "ts-morph";

import {DmmfField} from "../domain/DmmfField.js";
import {TransformContext} from "../domain/TransformContext.js";
import {transformFieldToDecorators} from "./transformFieldToDecorators.js";
import {transformScalarToType} from "./transformScalarToType.js";

export function transformFieldToProperty(field: DmmfField, ctx: TransformContext): PropertyDeclarationStructure {
  return {
    kind: StructureKind.Property,
    name: field.name,
    trailingTrivia: "\n",
    type: transformScalarToType(field, ctx),
    decorators: transformFieldToDecorators(field, ctx)
  };
}
