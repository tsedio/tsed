import {JsonHeader} from "@tsed/schema";
import {ServerlessContext} from "../domain/ServerlessContext";
import {HeaderValue} from "../domain/ServerlessResponse";

function mergeHeaders(specHeaders: Record<string, JsonHeader & {example: string}>, headers: Record<string, HeaderValue>) {
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
export function setResponseHeaders(ctx: ServerlessContext) {
  const {response, endpoint} = ctx;
  const operation = endpoint.operation!;

  if (response.isDone()) {
    return;
  }

  if (!response.hasStatus()) {
    // apply status only if the isn't already modified
    response.status(operation.getStatus());
  }

  const headers = operation.getHeadersOf(response.statusCode);
  response.setHeaders(mergeHeaders(headers, response.getHeaders()));

  if (endpoint.redirect) {
    response.redirect(endpoint.redirect.status, endpoint.redirect.url);
  }

  if (endpoint.location) {
    response.location(endpoint.location);
  }
}
