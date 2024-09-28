import {Type} from "@tsed/core";

import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods.js";
/**
 * @ignore
 */
export type ResponseFilterKey = "*/*" | "application/json" | "text/html" | "plain/text" | string;
/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
export const ResponseFiltersContainer = new Map<ResponseFilterKey, Type<ResponseFilterMethods>>();
/**
 * @ignore
 */
export function registerResponseFilter(type: ResponseFilterKey, token: Type<ResponseFilterMethods>) {
  ResponseFiltersContainer.set(type, token);
}
