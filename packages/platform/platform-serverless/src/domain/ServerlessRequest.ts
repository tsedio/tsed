import type {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, Context} from "aws-lambda";
import {getValue} from "@tsed/core";

export interface ServerlessRequestOptions {
  event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  context: Context;
}
/**
 * @platform
 */
export class ServerlessRequest {
  readonly raw: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;

  constructor({event}: ServerlessRequestOptions) {
    this.raw = event;
  }

  get secure(): boolean {
    return true;
  }

  get host(): string {
    return this.get("host");
  }

  get protocol(): string {
    return "https";
  }

  /**
   * Get the url of the request.
   *
   * Is equivalent of `express.response.originalUrl || express.response.url`.
   */
  get url(): string {
    return this.raw.path;
  }

  get headers() {
    return this.raw.headers;
  }

  get method(): string {
    return this.raw.httpMethod;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    try {
      return this.raw.body ? JSON.parse(this.raw.body) : {};
    } catch (er) {
      return this.raw.body;
    }
  }

  get rawBody(): any {
    return this.raw.body;
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params(): {[key: string]: any} {
    return this.raw.pathParameters || {};
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    return this.raw.queryStringParameters || {};
  }

  /**
   * Returns the HTTP request header specified by field. The match is case-insensitive.
   *
   * ```typescript
   * request.get('Content-Type') // => "text/plain"
   * ```
   *
   * @param name
   */
  get(name: string) {
    return getValue(this.raw.headers, name);
  }
}
