import {nameOf, Type} from "@tsed/core";
import {BadRequest} from "ts-httpexceptions";

/**
 * @private
 */
export class RequiredPropertyError extends BadRequest {
  errors: any[];

  constructor(target: Type<any>, propertyName: string | symbol) {
    super(RequiredPropertyError.buildMessage(target, propertyName));

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
   */
  static buildMessage(target: Type<any>, propertyName: string | symbol) {
    return `Property ${propertyName as string} on class ${nameOf(target)} is required.`;
  }
}
