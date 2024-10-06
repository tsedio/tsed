import {cleanObject} from "@tsed/core";

import {JsonHeader, JsonHeaders} from "../interfaces/JsonOpenSpec.js";

/**
 * Map input header to a standard open spec header
 * @param headers
 * @ignore
 */
export function mapHeaders(headers: JsonHeaders): {[key: string]: JsonHeader} {
  return Object.keys(headers).reduce((newHeaders: {[key: string]: JsonHeader}, key: string) => {
    const value: any = headers[key];

    let type = typeof value;

    let options: any = {
      example: value
    };

    if (type === "object") {
      options = value;
      options.example = options.value === undefined ? options.example : options.value;
      delete options.value;
      type = typeof options.example;
    }

    options.type = options.type || type;

    newHeaders[key] = cleanObject(options);

    return newHeaders;
  }, {});
}
