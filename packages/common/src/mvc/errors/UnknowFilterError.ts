import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "@tsed/exceptions";

/**
 * @private
 */
export class UnknowFilterError extends InternalServerError {
  name: "UNKNOW_FILTER_ERROR";
  status: 500;

  constructor(target: Type<any>) {
    super(UnknowFilterError.buildMessage(target));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any>) {
    return `Filter ${nameOf(target)} not found.`;
  }
}
