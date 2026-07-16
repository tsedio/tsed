import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods.js";
import {Type} from "@tsed/core";
/**
 * @ignore
 */
export type ExceptionFilterKey = Type<any> | Symbol | string;
/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
export const ExceptionFiltersContainer = new Map<ExceptionFilterKey, Type<ExceptionFilterMethods>>();
/**
 * @ignore
 */
export function registerExceptionType(type: ExceptionFilterKey, token: Type<ExceptionFilterMethods>) {
  ExceptionFiltersContainer.set(type, token);
}
