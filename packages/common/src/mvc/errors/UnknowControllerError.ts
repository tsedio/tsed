import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "ts-httpexceptions";

/**
 * @private
 */
export class UnknowControllerError extends InternalServerError {
  name: "UNKNOW_CONTROLLER_ERROR";

  constructor(target: Type<any> | string) {
    super(UnknowControllerError.buildMessage(target));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any> | string) {
    return `Controller ${nameOf(target)} not found.`;
  }
}
