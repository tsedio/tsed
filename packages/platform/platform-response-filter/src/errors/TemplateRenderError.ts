import type {Type} from "@tsed/core";
import {nameOf} from "@tsed/core";
import {InternalServerError} from "@tsed/exceptions";

/**
 * @private
 */
export class TemplateRenderError extends InternalServerError {
  name = "TEMPLATE_RENDER_ERROR";

  constructor(target: Type<any> | string, method: string | symbol, err: Error) {
    super(TemplateRenderError.buildMessage(target, method, err));
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any> | string, method: string | symbol, err: Error) {
    return `Template rendering error: ${nameOf(target)}.${String(method)}()\n` + err;
  }
}
