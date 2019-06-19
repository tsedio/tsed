import * as Express from "express";
import {EXPRESS_NEXT_FN} from "../constants";
import {UseFilter} from "./useFilter";

export type Next = Express.NextFunction;

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): Function {
  return UseFilter(EXPRESS_NEXT_FN);
}
