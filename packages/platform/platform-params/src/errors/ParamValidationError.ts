import {nameOf} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {JsonParameterStore} from "@tsed/schema";

import {ValidationError} from "./ValidationError.js";

export class ParamValidationError extends BadRequest {
  public name: string = "PARAM_VALIDATION_ERROR";
  public dataPath: string;
  public requestType: string;

  static from(metadata: JsonParameterStore, origin: any = {}) {
    if (origin instanceof ValidationError || origin instanceof BadRequest) {
      const name = nameOf(metadata.paramType)
        .toLowerCase()
        .replace(/parse|params|filter/gi, "");
      const expression = metadata.expression;
      const dataPath = `${name}${expression ? "." + expression : ""}`;
      const message = `Bad request on parameter "request.${dataPath}".\n${origin.message}`.trim();

      const error = new ParamValidationError(message);
      error.dataPath = String(metadata.expression) || "";
      error.requestType = nameOf(metadata.paramType);
      error.origin = origin.origin || origin;

      if (error.origin?.errors) {
        error.origin?.errors.forEach((error: any) => {
          error.requestPath = name;
          error.dataPath = error.dataPath || (expression ? `.${expression}` : "");
        });
      }

      return error;
    }

    return origin;
  }
}
