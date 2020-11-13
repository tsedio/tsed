import {Type} from "@tsed/core";
import type {ExceptionFilterMethods} from "../interfaces/ExceptionFilterMethods";

export type ExceptionFilterKey = Type<any> | Symbol | string;

// tslint:disable-next-line:variable-name
export const ExceptionFiltersContainer = new Map<ExceptionFilterKey, Type<ExceptionFilterMethods>>();

export function registerExceptionType(type: ExceptionFilterKey, token: Type<ExceptionFilterMethods>) {
  ExceptionFiltersContainer.set(type, token);
}
