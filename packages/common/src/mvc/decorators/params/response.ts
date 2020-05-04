import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

declare global {
  namespace TsED {
    export interface Response {}
  }
}

export interface Response extends TsED.Response {}

export interface Res extends TsED.Response {}

/**
 * Response service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Response(): ParameterDecorator;
export function Response(): ParameterDecorator {
  return Res();
}

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Res(): ParameterDecorator;
export function Res(): ParameterDecorator {
  return UseParam(ParamTypes.RESPONSE);
}
