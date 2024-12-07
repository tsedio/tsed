import {isObject} from "@tsed/core";
import {type BaseContext, inject, injectable} from "@tsed/di";

import {ANY_CONTENT_TYPE} from "../constants/ANY_CONTENT_TYPE.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

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

/**
 * @ignore
 */
function resolver(data: any, ctx: BaseContext) {
  const contentType = getContentType(data, ctx);

  if (ctx.request.get("Accept")) {
    const {contentTypes} = inject<PLATFORM_CONTENT_TYPES_CONTAINER>(PLATFORM_CONTENT_TYPES_CONTAINER);

    const bestContentType = ctx.request.accepts([contentType].concat(contentTypes).filter(Boolean));

    if (bestContentType) {
      return [].concat(bestContentType as any).filter((type) => type !== "*/*")[0];
    }
  }

  return contentType;
}

/**
 * @ignore
 */
export type PLATFORM_CONTENT_TYPE_RESOLVER = typeof resolver;
export const PLATFORM_CONTENT_TYPE_RESOLVER = injectable(Symbol.for("PLATFORM_CONTENT_TYPE_RESOLVER"))
  .factory(() => resolver)
  .token();
