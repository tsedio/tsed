import {getValue} from "@tsed/core";

import {GCPContext} from "./GCPContext.js";
import {isHttpEvent} from "./GCPEvent.js";

/**
 * @platform
 */
export class GCPRequest {
  constructor(protected $ctx: GCPContext) {}

  /**
   * Get the raw GCP event
   */
  get event() {
    return this.$ctx.event;
  }

  /**
   * Get the raw event data
   */
  get raw() {
    return this.$ctx.event;
  }

  get response() {
    return this.$ctx.response;
  }

  get secure(): boolean {
    if (isHttpEvent(this.event)) {
      return this.event.req.secure;
    }

    return true;
  }

  get host(): string {
    if (isHttpEvent(this.event)) {
      return this.event.req.hostname;
    }

    return "";
  }

  get protocol(): string {
    if (isHttpEvent(this.event)) {
      return this.event.req.protocol;
    }

    return "https";
  }

  /**
   * Get the url of the request.
   */
  get url(): string {
    if (isHttpEvent(this.event)) {
      return this.event.req.url;
    }

    return "";
  }

  get headers() {
    if (isHttpEvent(this.event)) {
      return this.event.req.headers;
    }

    return {};
  }

  get method(): string {
    if (isHttpEvent(this.event)) {
      return this.event.req.method;
    }

    return "";
  }

  /**
   * Contains key-value pairs of data submitted in the request body.
   */
  get body(): any {
    if (isHttpEvent(this.event)) {
      return this.event.req.body;
    }

    return this.event.data;
  }

  get rawBody(): any {
    return this.body;
  }

  /**
   * This property is an object containing properties mapped to the named route parameters.
   */
  get params(): {[key: string]: any} {
    return (isHttpEvent(this.event) && this.event.req.params) || {};
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   */
  get query(): {[key: string]: any} {
    return (isHttpEvent(this.event) && this.event.req.query) || {};
  }

  /**
   * Returns the HTTP request header specified by field. The match is case-insensitive.
   *
   * @param name
   */
  get(name: string) {
    if (isHttpEvent(this.event)) {
      return getValue(this.event.req.headers, name);
    }

    return undefined;
  }
}
