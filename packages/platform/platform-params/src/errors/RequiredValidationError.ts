import {nameOf} from "@tsed/core";
import {JsonParameterStore} from "@tsed/schema";

import {ValidationError} from "./ValidationError.js";

export class RequiredValidationError extends ValidationError {
  public name: string = "REQUIRED_VALIDATION_ERROR";

  static from(metadata: JsonParameterStore) {
    const name = nameOf(metadata.paramType);
    const expression = metadata.expression;
    const type = name.toLowerCase().replace(/parse|params|filter/gi, "");
    const message = `It should have required parameter '${expression}'`;

    const errors = [
      {
        dataPath: "",
        keyword: "required",
        message,
        modelName: type,
        params: {
          missingProperty: expression
        },
        schemaPath: "#/required"
      }
    ];

    return new RequiredValidationError(message, errors);
  }
}
