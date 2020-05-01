import {ObjectSchema} from "@hapi/joi";
import {Injectable, IPipe, ParamMetadata, ValidationError} from "@tsed/common";

@Injectable()
export class JoiValidationPipe implements IPipe {
  transform(value: any, metadata: ParamMetadata) {
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

