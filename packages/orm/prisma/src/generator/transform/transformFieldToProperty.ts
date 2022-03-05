import {PropertyDeclarationStructure, StructureKind} from "ts-morph";
import {DmmfField} from "../domain/DmmfField";
import {TransformContext} from "../domain/TransformContext";
import {transformFieldToDecorators} from "./transformFieldToDecorators";
import {transformScalarToType} from "./transformScalarToType";

export function transformFieldToProperty(field: DmmfField, ctx: TransformContext): PropertyDeclarationStructure {
  return {
    kind: StructureKind.Property,
    name: field.name,
    trailingTrivia: "\n",
    type: transformScalarToType(field),
    decorators: transformFieldToDecorators(field, ctx)
  };
}
