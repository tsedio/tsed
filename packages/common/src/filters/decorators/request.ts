import * as Express from "express";
import {EXPRESS_REQUEST} from "../constants";
import {ParamRegistry} from "../registries/ParamRegistry";

export type Request = Express.Request;
export type Req = Express.Request;

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Request(): Function {
  return Req();
}

/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 * @alias Request
 */
export function Req() {
  return ParamRegistry.decorate(EXPRESS_REQUEST);
}
