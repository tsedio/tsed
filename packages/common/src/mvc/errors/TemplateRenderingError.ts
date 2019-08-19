import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "ts-httpexceptions";

/**
 * @private
 */
export class TemplateRenderingError extends InternalServerError {
  name: "TEMPLATING_RENDER_ERROR";

  constructor(target: Type<any> | string, method: string | symbol, err: Error) {
    super(TemplateRenderingError.buildMessage(target, method, err));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any> | string, method: string | symbol, err: Error) {
    return `Template rendering error : ${nameOf(target)}.${String(method)}()\n` + err;
  }
}
