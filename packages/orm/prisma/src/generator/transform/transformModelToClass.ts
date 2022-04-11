import {StatementStructures, StructureKind} from "ts-morph";
import {DmmfModel} from "../domain/DmmfModel";
import {TransformContext} from "../domain/TransformContext";
import {transformFieldToProperty} from "./transformFieldToProperty";

export function transformModelToClass(model: DmmfModel, ctx: TransformContext): StatementStructures {
  model.addImportDeclaration("../client", model.name);

  return {
    kind: StructureKind.Class,
    name: model.toString(),
    trailingTrivia: "\n",
    leadingTrivia: "\n",
    isExported: true,
    implements: [model.name],
    properties: model.fields.map((field) => transformFieldToProperty(field, ctx))
  };
}
