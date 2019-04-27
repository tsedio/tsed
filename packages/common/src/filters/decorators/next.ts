import * as Express from "express";
import {EXPRESS_NEXT_FN} from "../constants";
import {ParamRegistry} from "../registries/ParamRegistry";

export type Next = Express.NextFunction;

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): Function {
  return ParamRegistry.decorate(EXPRESS_NEXT_FN);
}
