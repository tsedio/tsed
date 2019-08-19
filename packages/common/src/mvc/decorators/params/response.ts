import * as Express from "express";
import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";

export type Response = Express.Response;
export type Res = Express.Response;

/**
 * Response service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Response(): ParameterDecorator {
  return Res();
}

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Res(): ParameterDecorator {
  return UseFilter(ParamTypes.RESPONSE);
}
