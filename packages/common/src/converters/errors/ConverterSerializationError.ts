import {InternalServerError} from "ts-httpexceptions";
import {Type, nameOf} from "@tsed/core";

/**
 * @private
 */
export class ConverterSerializationError extends InternalServerError {
  name: string = "CONVERTER_SERIALIZATION_ERROR";
  stack: any;

  constructor(target: Type<any>, err: Error) {
    super(ConverterSerializationError.buildMessage(target, err));
    this.stack = err.stack;
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any>, err: Error) {
    return `Conversion failed for "${nameOf(target)}". ${err.message}`.trim();
  }
}
