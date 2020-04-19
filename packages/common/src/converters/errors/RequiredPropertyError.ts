import {nameOf, Type} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";

/**
 * @private
 */
export class RequiredPropertyError extends BadRequest {
  errors: any[];

  constructor(target: Type<any>, propertyName: string | symbol, value: any) {
    super(RequiredPropertyError.buildMessage(target, propertyName, value));

    this.errors = [
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
    ];
  }

  /**
   *
   * @returns {string}
   * @param target
   * @param propertyName
   * @param value
   */
  static buildMessage(target: Type<any>, propertyName: string | symbol, value: any) {
    return `Property ${propertyName as string} on class ${nameOf(target)} is required. Given value: ${value}`;
  }
}
