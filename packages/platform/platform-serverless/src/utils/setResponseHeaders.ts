import {ServerlessContext} from "../domain/ServerlessContext";

function toHeaders(headers: {[key: string]: any}) {
  return Object.entries(headers).reduce((headers, [key, item]) => {
    return {
      ...headers,
      [key]: item.example as any
    };
  }, {});
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
  response.setHeaders(toHeaders(headers));

  if (endpoint.redirect) {
    response.redirect(endpoint.redirect.status || 302, endpoint.redirect.url);
  }

  if (endpoint.location) {
    response.location(endpoint.location);
  }
}
