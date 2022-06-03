import {PlatformContext} from "../domain/PlatformContext";

/**
 * @ignore
 */
export function setResponseHeaders(ctx: PlatformContext) {
  const {response, endpoint} = ctx;
  const {operation} = endpoint;

  if (response.isDone()) {
    return;
  }

  if (!response.hasStatus()) {
    // apply status only if the isn't already modified
    response.status(operation.getStatus());
  }

  const statusCode = response.statusCode;
  const headers = operation.getHeadersOf(statusCode);

  Object.entries(headers).forEach(([key, item]) => {
    if (!response.get(key)) {
      response.setHeader(key, String(item.example));
    }
  });

  if (operation.isRedirection(statusCode)) {
    response.redirect(statusCode, response.get("location"));
  }
}
