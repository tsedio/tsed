import {nameOf, Type} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";

/**
 * @private
 */
export class UnknownPropertyError extends BadRequest {
  errors: any[];

  constructor(target: Type<any>, propertyName: string | symbol) {
    super(UnknownPropertyError.buildMessage(target, propertyName));

    this.errors = [
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
    ];
  }

  /**
   *
   * @returns {string}
   * @param target
   * @param propertyName
   */
  static buildMessage(target: Type<any>, propertyName: string | symbol) {
    return `Property ${String(propertyName)} on class ${nameOf(target)} is not allowed.`;
  }
}
