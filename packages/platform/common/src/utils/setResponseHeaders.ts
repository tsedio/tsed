import {JsonHeader} from "@tsed/schema";
import {OutgoingHttpHeaders} from "http";
import {PlatformContext} from "../domain/PlatformContext";

function mergeHeaders(specHeaders: Record<string, JsonHeader & {example: string}>, headers: OutgoingHttpHeaders) {
  return Object.entries(specHeaders).reduce((headers, [key, item]) => {
    key = key.toLowerCase();
    return {
      ...headers,
      [key]: headers[key] === undefined ? String(item.example) : headers[key]
    };
  }, headers);
}

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
  const headers = operation.getHeadersOf(response.statusCode);
  const mergedHeaders = mergeHeaders(headers, response.getHeaders());

  response.setHeaders(mergedHeaders);

  if (operation.isRedirection(statusCode)) {
    response.redirect(statusCode, String(mergedHeaders["location"]));
  }
}
