import {ParamMetadata} from "../models/ParamMetadata";
import {nameOf} from "@tsed/core";
import {ValidationError} from "./ValidationError";

export class RequiredValidationError extends ValidationError {
  public name: string = "REQUIRED_VALIDATION_ERROR";
  public errors: any[];

  static from(metadata: ParamMetadata) {
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
