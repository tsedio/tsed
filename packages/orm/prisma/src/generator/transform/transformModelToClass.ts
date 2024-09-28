import {StatementStructures, StructureKind} from "ts-morph";

import {DmmfModel} from "../domain/DmmfModel.js";
import {TransformContext} from "../domain/TransformContext.js";
import {transformFieldToProperty} from "./transformFieldToProperty.js";

export function transformModelToClass(model: DmmfModel, ctx: TransformContext): StatementStructures {
  model.addImportDeclaration("../client/index", model.name);

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
