import {ValidationError, ValidationPipe} from "@tsed/platform-params";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {OverrideProvider} from "@tsed/di";
import {getJsonSchema} from "@tsed/schema";
import {validate} from "./validate";

@OverrideProvider(ValidationPipe)
export class CustomValidationPipe extends ValidationPipe implements PipeMethods {
  public transform(obj: any, metadata: JsonParameterStore): void {
    // JSON service contain tool to build the Schema definition of a model.
    const schema = getJsonSchema(metadata.type);

    if (schema) {
      const valid = validate(schema, obj);

      if (!valid) {
        throw new ValidationError("My message", [
          /// list of errors
        ]);
      }
    }
  }
}
