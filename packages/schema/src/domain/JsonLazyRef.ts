import {nameOf, Type} from "@tsed/core";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {serializeJsonSchema} from "../utils/serializeJsonSchema";
import {JsonEntityStore} from "./JsonEntityStore";

export class JsonLazyRef {
  constructor(readonly getType: () => Type<any>) {}

  get target() {
    return this.getType();
  }

  get schema() {
    return JsonEntityStore.from(this.getType()).schema;
  }

  get name() {
    return nameOf(this.getType());
  }

  toJSON(options?: JsonSchemaOptions) {
    return this.getType() && serializeJsonSchema(this.schema, options);
  }
}
