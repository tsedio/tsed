import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Response(): ParameterDecorator;
export function Response(): ParameterDecorator {
  return Res();
}

/**
 * Request service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Res(): ParameterDecorator;
export function Res(): ParameterDecorator {
  return UseParam(ParamTypes.RESPONSE);
}

/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Response extends TsED.Response {}
/**
 * Response service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Res extends TsED.Response {}
