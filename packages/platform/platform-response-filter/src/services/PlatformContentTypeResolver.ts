import {isBoolean, isNumber, isObject, isStream} from "@tsed/core";
import {type BaseContext, inject, injectable} from "@tsed/di";

import {ContentTypes} from "../constants/ContentTypes.js";
import {PLATFORM_CONTENT_TYPES_CONTAINER} from "./PlatformContentTypesContainer.js";

const isJsonData = (data: unknown) => {
  return (isObject(data) || isNumber(data) || isBoolean(data)) && !isStream(data) && !Buffer.isBuffer(data);
};

/**
 * Determine the content type of the response based on the data and the context.
 * @param {unknown} data
 * @param {BaseContext} ctx
 * @ignore
 */
export function getContentType(data: unknown, ctx: BaseContext) {
  const {endpoint, response} = ctx;
  const contentType = response.getContentType() || endpoint.operation.getContentTypeOf(response.statusCode);

  if (contentType && contentType !== ContentTypes.ANY) {
    return contentType;
  }

  return endpoint.view ? ContentTypes.HTML : isJsonData(data) ? ContentTypes.JSON : contentType;
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
      return [].concat(bestContentType as any).filter((type) => type !== ContentTypes.ANY)[0];
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
