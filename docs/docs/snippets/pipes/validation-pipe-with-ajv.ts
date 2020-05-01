import {getJsonSchema, IPipe, ParamMetadata, ValidationError} from "@tsed/common";
import {Injectable} from "@tsed/di";
import * as Ajv from "ajv";

@Injectable()
export class AjvValidationPipe implements IPipe {
  ajv = new Ajv();

  transform(value: any, metadata: ParamMetadata): any {
    const schema = getJsonSchema(metadata.type);

    if (!this.ajv.validate(schema, value)) {
      throw new ValidationError("Oops something is wrong", this.ajv.errors!);
    }

    return value;
  }
}
