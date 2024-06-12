import {JsonHeader} from "@tsed/schema";
import {ServerlessContext} from "../domain/ServerlessContext.js";
import {HeaderValue} from "../domain/ServerlessResponse.js";

function mergeHeaders(specHeaders: Record<string, JsonHeader & {example: string}>, headers: Record<string, HeaderValue>) {
  return Object.entries(specHeaders).reduce((headers, [key, item]) => {
    key = key.toLowerCase();

    const value = headers[key] === undefined ? item.example : headers[key];

    if (value !== undefined) {
      return {
        ...headers,
        [key]: String(value)
      };
    }

    return headers;
  }, headers);
}

/**
 * @ignore
 */
export function setResponseHeaders(ctx: ServerlessContext) {
  const {response, endpoint} = ctx;
  const operation = endpoint.operation;

  if (ctx.isDone()) {
    return;
  }

  if (!operation) {
    ctx.logger.debug({
      event: "MISSING_OPERATION_METADATA",
      message: "No operation found on the endpoint. The response headers are not set.",
      endpoint: endpoint
    });
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
