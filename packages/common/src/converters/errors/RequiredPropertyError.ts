import {nameOf, Type} from "@tsed/core";
import {ValidationError} from "../../mvc/errors/ValidationError";

/**
 * @deprecated Ajv or validation library must perform this validation
 */
export class RequiredPropertyError extends ValidationError {
  errors: any[];

  constructor(target: Type<any>, propertyName: string | symbol, value: any) {
    super(`Property ${propertyName as string} on class ${nameOf(target)} is required. Given value: ${value}`, [
      {
        dataPath: "",
        keyword: "required",
        message: `should have required property '${String(propertyName)}'`,
        modelName: nameOf(target),
        params: {
          missingProperty: propertyName
        },
        schemaPath: "#/required"
      }
    ]);
  }
}
