import {isObject} from "@tsed/core";
import type {BaseContext} from "@tsed/di";

export const ANY_CONTENT_TYPE = "*/*";

/**
 * @ignore
 */
export function getContentType(data: any, ctx: BaseContext) {
  const {endpoint, response} = ctx;
  const {operation} = endpoint;

  const contentType = response.getContentType() || operation.getContentTypeOf(response.statusCode) || "";

  if (contentType && contentType !== ANY_CONTENT_TYPE) {
    if (contentType === "application/json" && isObject(data)) {
      return "application/json";
    }

    return contentType;
  }

  if (endpoint.view) {
    return "text/html";
  }
}
