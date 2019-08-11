import * as Express from "express";
import {ParamTypes} from "../../models/ParamTypes";
import {UseFilter} from "./useFilter";

export type Next = Express.NextFunction;

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Next(): ParameterDecorator {
  return UseFilter(ParamTypes.NEXT_FN, {
    useConverter: false,
    useValidation: false
  });
}
