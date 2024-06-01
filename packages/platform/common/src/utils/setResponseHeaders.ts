import {PlatformContext} from "../domain/PlatformContext.js";

/**
 * @ignore
 */
export function setResponseHeaders(ctx: PlatformContext) {
  const {response, endpoint} = ctx;
  const {operation} = endpoint;

  if (ctx.isDone()) {
    return;
  }

  if (!response.hasStatus()) {
    // apply status only if the isn't already modified
    response.status(operation.getStatus());
  }

  const statusCode = response.statusCode;
  const headers = operation.getHeadersOf(statusCode);

  Object.entries(headers).forEach(([key, item]: any[]) => {
    if (!response.get(key) && item.example !== undefined) {
      response.setHeader(key, String(item.example));
    }
  });

  if (operation.isRedirection(statusCode)) {
    response.redirect(statusCode, response.get("location"));
  }
}
