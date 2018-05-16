/**
 * @module common/mvc
 */
/** */

import {BadRequest} from "ts-httpexceptions";
import {IResponseError} from "../../mvc/interfaces/IResponseError";

/**
 * @private
 */
export class RequiredParamError extends BadRequest implements IResponseError {
  errors: any[];

  constructor(name: string, expression: string | RegExp) {
    super(RequiredParamError.buildMessage(name, "" + expression));
    const type = name.toLowerCase().replace(/parse|params|filter/gi, "");

    this.errors = [
      {
        dataPath: "",
        keyword: "required",
        message: `should have required param '${expression}'`,
        modelName: type,
        params: {
          missingProperty: expression
        },
        schemaPath: "#/required"
      }
    ];
  }

  /**
   *
   * @param name
   * @param expression
   * @returns {string}
   */
  static buildMessage(name: string, expression: string) {
    name = name.toLowerCase().replace(/parse|params|filter/gi, "");

    return `Bad request, parameter "request.${name}.${expression}" is required.`;
  }
}
