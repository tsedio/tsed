import * as Express from "express";
import {EXPRESS_RESPONSE} from "../constants";
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
  return UseFilter(EXPRESS_RESPONSE);
}
