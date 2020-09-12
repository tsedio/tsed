import {PlatformContext} from "../domain/PlatformContext";
import {isObject} from "@tsed/core";

export function setResponseContentType(data: any, ctx: PlatformContext) {
  const {endpoint, response} = ctx;
  const {operation} = endpoint;

  const contentType = operation.getContentTypeOf(response.statusCode) || "";

  if (contentType && contentType !== "*/*") {
    if (contentType === "application/json") {
      if (isObject(data)) {
        response.contentType(contentType);
      }
    } else {
      response.contentType(contentType);
    }
  }
}
