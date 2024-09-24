import {Injectable} from "@tsed/di";
import {ValidationError} from "@tsed/platform-params";
import {getJsonSchema, JsonParameterStore, PipeMethods} from "@tsed/schema";
import * as Ajv from "ajv";

@Injectable()
export class AjvValidationPipe implements PipeMethods {
  ajv = new Ajv();

  transform(value: any, metadata: JsonParameterStore): any {
    const schema = getJsonSchema(metadata.type);

    if (!this.ajv.validate(schema, value)) {
      throw new ValidationError("Oops something is wrong", this.ajv.errors!);
    }

    return value;
  }
}
