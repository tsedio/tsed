import {deepMerge} from "@tsed/core";
import {IResponseHeader, IResponseHeaders} from "../../interfaces";
import {EndpointFn} from "./endpointFn";

export type IHeaderOptions = string | number | IResponseHeader;

export interface IHeadersOptions {
  [key: string]: IHeaderOptions;
}

export function mapHeaders(headers: IHeadersOptions): IResponseHeaders {
  return Object.keys(headers).reduce<IResponseHeaders>((newHeaders: IResponseHeaders, key: string, index: number, array: string[]) => {
    const value: any = headers[key];
    let type = typeof value;
    let options: any = {
      value
    };

    if (type === "object") {
      options = value;
      type = typeof options.value;
    }

    options.type = options.type || type;

    newHeaders[key] = options;

    return newHeaders;
  }, {});
}

/**
 * Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.
 *
 * ```typescript
 * @Header('Content-Type', 'text/plain');
 * private myMethod() {}
 *
 * @Status(204)
 * @Header({
 *   "Content-Type": "text/plain",
 *   "Content-Length": 123,
 *   "ETag": {
 *     "value": "12345",
 *     "description": "header description"
 *   }
 * })
 * private myMethod() {}
 * ```
 *
 * This example will produce the swagger responses object:
 *
 * ```json
 * {
 *   "responses": {
 *     "204": {
 *       "description": "Description",
 *       "headers": {
 *          "Content-Type": {
 *             "type": "string"
 *          },
 *          "Content-Length": {
 *             "type": "number"
 *          },
 *          "ETag": {
 *             "type": "string",
 *             "description": "header description"
 *          }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param headerName
 * @param headerValue
 * @returns {Function}
 * @decorator
 * @endpoint
 */
export function Header(headerName: string | number | IHeadersOptions, headerValue?: IHeaderOptions): Function {
  if (headerValue !== undefined) {
    headerName = {[headerName as string]: headerValue};
  }
  const headers: IResponseHeaders = mapHeaders(headerName as IHeadersOptions);

  return EndpointFn(endpoint => {
    const {response} = endpoint;

    response.headers = deepMerge(response.headers || {}, headers);
  });
}
