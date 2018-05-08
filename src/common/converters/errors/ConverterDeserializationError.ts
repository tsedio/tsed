import {nameOf, Type} from "@tsed/core";
import {InternalServerError} from "ts-httpexceptions";

/**
 * @private
 */
export class ConverterDeserializationError extends InternalServerError {
  name: string = "CONVERTER_DESERIALIZATION_ERROR";
  stack: any;

  constructor(target: Type<any>, obj: any, err: Error) {
    super(ConverterDeserializationError.buildMessage(target, obj, err));
    this.stack = err.stack;
  }

  /**
   *
   * @returns {string}
   */
  static buildMessage(target: Type<any>, obj: any, err: Error) {
    return `Conversion failed for class "${nameOf(target)}" with object => ${JSON.stringify(obj)}.\n${err.message}`.trim();
  }
}
