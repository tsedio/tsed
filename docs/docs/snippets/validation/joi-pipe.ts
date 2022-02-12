import {ObjectSchema} from "@hapi/joi";
import {Injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ValidationError} from "@tsed/platform-params";

@Injectable()
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
