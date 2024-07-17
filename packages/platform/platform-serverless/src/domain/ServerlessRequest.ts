import {getValue} from "@tsed/core";
import type {APIGatewayProxyEvent} from "aws-lambda";
import {ServerlessContext} from "./ServerlessContext.js";

/**
 * @platform
 */
export class ServerlessRequest<Event = APIGatewayProxyEvent> {
  constructor(protected $ctx: ServerlessContext<Event>) {}

  get event() {
    return this.getEvent();
  }

  get raw() {
    return this.event;
  }

  get response() {
    return this.$ctx.response;
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
    return this.getEvent<APIGatewayProxyEvent>().path;
  }

  get headers() {
    return this.getEvent<APIGatewayProxyEvent>().headers;
  }

  get method(): string {
    return this.getEvent<APIGatewayProxyEvent>().httpMethod;
  }

  /**
   * Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use
   * `body-parsing` middleware such as `express.json()` or `express.urlencoded()`.
   */
  get body(): any {
    try {
      return this.getEvent<APIGatewayProxyEvent>().body ? JSON.parse(this.getEvent<APIGatewayProxyEvent>().body!) : {};
    } catch (er) {
      return this.getEvent<APIGatewayProxyEvent>().body;
    }
  }

  get rawBody(): any {
    return this.getEvent<APIGatewayProxyEvent>().body;
  }

  /**
   * This property is an object containing properties mapped to the named route `parameters`.
   * For example, if you have the route `/user/:name`, then the `name` property is available as `req.params.name`.
   * This object defaults to `{}`.
   */
  get params(): {[key: string]: any} {
    return this.getEvent<APIGatewayProxyEvent>().pathParameters || {};
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.
   */
  get query(): {[key: string]: any} {
    return this.getEvent<APIGatewayProxyEvent>().queryStringParameters || {};
  }

  getEvent<E = Event>(): E {
    return this.$ctx.event as unknown as E;
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
    return getValue(this.getEvent<APIGatewayProxyEvent>().headers, name);
  }
}
