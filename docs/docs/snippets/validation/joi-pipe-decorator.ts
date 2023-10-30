import {ObjectSchema} from "joi";
import {StoreSet} from "@tsed/core";
import {JoiValidationPipe} from "../pipes/JoiValidationPipe";

export function UseJoiSchema(schema: ObjectSchema) {
  return StoreSet(JoiValidationPipe, schema);
}
