import {isObject, isStream} from "@tsed/core";
import {type BaseContext, inject, injectable} from "@tsed/di";

import {ANY_CONTENT_TYPE} from "../constants/ANY_CONTENT_TYPE.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

/**
 * Determine the content type of the response based on the data and the context.
 * @param {unknown} data
 * @param {BaseContext} ctx
 * @ignore
 */
export function getContentType(data: unknown, ctx: BaseContext) {
  const {
    endpoint,
    endpoint: {operation},
    response
  } = ctx;

  const contentType = response.getContentType() || operation.getContentTypeOf(response.statusCode);

  if (contentType && contentType !== ANY_CONTENT_TYPE) {
    return contentType === "application/json" && isObject(data) ? "application/json" : contentType;
  }

  if (endpoint.view) {
    return "text/html";
  }

  return isObject(data) && !isStream(data) && !Buffer.isBuffer(data) ? "application/json" : contentType;
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
