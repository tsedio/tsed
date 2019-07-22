import * as Express from "express";
import {EXPRESS_REQUEST} from "../constants";
import {UseFilter} from "./useFilter";

export type Request = Express.Request;
export type Req = Express.Request;

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Request(): ParameterDecorator {
  return Req();
}

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Req(): ParameterDecorator {
  return UseFilter(EXPRESS_REQUEST);
}
