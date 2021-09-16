import {HeaderValue} from "../domain/ServerlessResponse";
import {isArray} from "@tsed/core";

export function mapResponseHeaders(headers: Record<string, HeaderValue>): Record<string, boolean | string | number> {
  return Object.entries(headers).reduce((headers, [key, value]) => {
    if (isArray(value)) {
      return headers;
    }
    return {
      ...headers,
      [key]: value
    };
  }, {});
}

export function mapResponseMultiValueHeaders(headers: Record<string, HeaderValue>): Record<string, Array<boolean | string | number>> {
  return Object.entries(headers).reduce((headers, [key, value]) => {
    if (!isArray(value)) {
      return headers;
    }

    return {
      ...headers,
      [key]: value
    };
  }, {});
}
