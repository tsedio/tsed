import {DMMF} from "@prisma/generator-helper";

import {parseDocumentationAttributes} from "../utils/parseDocumentationAttributes.js";
import type {DmmfModel} from "./DmmfModel.js";

export class DmmfField {
  readonly model: DmmfModel;
  readonly field: DMMF.Field;
  readonly schemaArg: DMMF.SchemaArg;

  constructor({field, schemaArg, model}: any) {
    this.field = field;
    this.model = model;
    this.schemaArg = schemaArg;
  }

  get name() {
    return this.field.name;
  }

  get isRequired() {
    return this.field.isRequired;
  }

  get type() {
    return this.field.type;
  }

  get isList() {
    return this.field.isList;
  }

  get kind() {
    return this.field.kind;
  }

  get isNullable() {
    return this.schemaArg.isNullable;
  }

  get location(): "enumTypes" | "inputObjectTypes" | "scalar" {
    return this.field.kind === "enum" ? "enumTypes" : this.field.kind === "object" ? "inputObjectTypes" : "scalar";
  }

  getAdditionalDecorators() {
    return parseDocumentationAttributes(this.field.documentation);
  }

  toString() {
    return this.name;
  }
}
