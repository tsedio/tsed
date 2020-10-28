import {Type} from "@tsed/core";
import {ResponseFilterMethods} from "../interfaces/ResponseFilterMethods";

export type ResponseFilterKey = "*/*" | "application/json" | "text/html" | "plain/text" | string;

// tslint:disable-next-line:variable-name
export const ResponseFiltersContainer = new Map<ResponseFilterKey, Type<ResponseFilterMethods>>();

export function registerResponseFilter(type: ResponseFilterKey, token: Type<ResponseFilterMethods>) {
  ResponseFiltersContainer.set(type, token);
}
