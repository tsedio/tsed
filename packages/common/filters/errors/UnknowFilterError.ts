import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "ts-httpexceptions";

/**
 * @private
 */
export class UnknowFilterError extends InternalServerError {
  name: "UNKNOW_FILTER_ERROR";
  status: 500;

  constructor(target: Type<any> | string) {
    super(UnknowFilterError.buildMessage(target));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any> | string) {
    return `Filter ${nameOf(target)} not found.`;
  }
}
