import {Injectable} from "@tsed/di";
import {ValidationError, ValidationPipe} from "@tsed/platform-params";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ObjectSchema} from "joi";

@OverrideProvider(ValidationPipe)
export class JoiValidationPipe implements PipeMethods {
  transform(value: any, metadata: JsonParameterStore) {
    const schema = metadata.store.get<ObjectSchema>(JoiValidationPipe);

    if (schema) {
      const {error} = schema.validate(value);

      if (error) {
        throw new ValidationError("Oops something is wrong", [error]);
      }
    }

    return value;
  }
}
