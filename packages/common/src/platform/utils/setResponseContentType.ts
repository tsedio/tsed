import {isObject} from "@tsed/core";
import {PlatformContext} from "../domain/PlatformContext";

/**
 * @ignore
 */
export function getContentType(data: any, ctx: PlatformContext) {
  const {endpoint, response} = ctx;
  const {operation} = endpoint;

  const contentType = operation.getContentTypeOf(response.statusCode) || "";

  if (contentType && contentType !== "*/*") {
    if (contentType === "application/json") {
      if (isObject(data)) {
        return contentType;
      }
    } else {
      return contentType;
    }
  }
}

/**
 * @ignore
 */
export function setResponseContentType(data: any, ctx: PlatformContext) {
  const {response} = ctx;
  const contentType = getContentType(data, ctx);

  if (contentType) {
    response.contentType(contentType);
  }

  return contentType;
}
