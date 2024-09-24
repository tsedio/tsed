import {Type} from "@tsed/core";

import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods.js";
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
