import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "ts-httpexceptions";

/**
 * @private
 */
export class UnknowMiddlewareError extends InternalServerError {
  name: "UNKNOW_MIDDLEWARE_ERROR";

  constructor(target: Type<any> | string) {
    super(UnknowMiddlewareError.buildMessage(target));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any> | string) {
    return `Middleware ${nameOf(target)} not found.`;
  }
}
