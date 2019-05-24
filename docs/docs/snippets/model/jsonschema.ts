import {JsonSchemesService, OverrideService, ValidationService} from "@tsed/common";
import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {BadRequest} from "ts-httpexceptions";

@OverrideService(ValidationService)
export class AjvService extends ValidationService {
  constructor(private jsonSchemaService: JsonSchemesService) {
    super();
  }

  public validate(obj: any, targetType: any, baseType?: any): void {
    const schema = this.jsonSchemaService.getSchemaDefinition(targetType);

    if (schema) {
      const ajv = new Ajv();
      const valid = ajv.validate(schema, obj);

      if (!valid) {
        throw(this.buildErrors(ajv.errors!));
      }
    }
  }

  private buildErrors(errors: ErrorObject[]) {

    const message = errors.map(error => {
      return `{{name}}${error.dataPath} ${error.message} (${error.keyword})`;
    }).join("\n");

    return new BadRequest(message);
  }
}
