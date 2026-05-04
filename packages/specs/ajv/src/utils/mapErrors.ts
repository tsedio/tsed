import {getValue, nameOf, Type} from "@tsed/core";
import {ErrorObject} from "ajv";

import {AjvValidationError} from "../errors/AjvValidationError.js";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/AjvSettings.js";
import {getPath} from "./getPath.js";
import {mapClassError} from "./mapClassError.js";

export interface MapErrorsOptions {
  collectionType?: Type<any> | any;
  errorFormatter: ErrorFormatter;
  type?: Type<any> | any;
  value: unknown;
}

/**
 * Map raw AJV errors to framework-level validation error output.
 *
 * Enriches errors with collection/model information and contextual data values,
 * then formats each message via the configured `errorFormatter`.
 *
 * @param errors Raw AJV error objects.
 * @param options Validation context used to enrich error payloads.
 * @returns Normalized Ts.ED validation error.
 */
export function mapErrors(errors: ErrorObject[], options: MapErrorsOptions) {
  const {type, collectionType, value, errorFormatter} = options;

  const message = (errors as AjvErrorObject[])
    .map((error) => {
      if (collectionType) {
        error.collectionName = nameOf(collectionType);
      }

      const dataPath = getPath(error);

      if (error.data === undefined) {
        if (dataPath) {
          error.data = getValue(value, dataPath.replace(/^\./, ""));
        } else if (error.schemaPath !== "#/required") {
          error.data = value;
        }
      }

      if (dataPath && dataPath.match(/pwd|password|mdp|secret/i)) {
        error.data = "[REDACTED]";
      }

      if (type) {
        error.modelName = nameOf(type);
        error.message = mapClassError(error, type);
      }

      return errorFormatter(error);
    })
    .join("\n");

  return new AjvValidationError(message, errors);
}
