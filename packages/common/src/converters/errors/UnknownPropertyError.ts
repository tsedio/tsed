import {nameOf, Type} from "@tsed/core";
import {ValidationError} from "../../mvc/errors/ValidationError";

/**
 *
 */
export class UnknownPropertyError extends ValidationError {
  public name: string = "UNKNOWN_PROPERTY_ERROR";

  constructor(target: Type<any>, propertyName: string | symbol) {
    super(`Property ${String(propertyName)} on class ${nameOf(target)} is not allowed.`, [
      {
        dataPath: "",
        keyword: "unknown",
        message: `should not have property '${String(propertyName)}'`,
        modelName: nameOf(target),
        params: {
          missingProperty: propertyName
        },
        schemaPath: "#/unknown"
      }
    ]);
  }
}
