import {PlatformContext, PlatformResponse} from "@tsed/common";
import contentDisposition from "content-disposition";
import {FastifyReply} from "fastify";
import type {ServerResponse} from "http";

declare global {
  namespace TsED {
    export interface Response extends FastifyReply {
      locals: Record<string, unknown>;
    }
  }
}

/**
 * @platform
 * @fastify
 */
export class PlatformFastifyResponse extends PlatformResponse<TsED.Response> {
  constructor(readonly $ctx: PlatformContext) {
    super($ctx);
    this.raw.locals = {};
  }

  /**
   * Return the Node.js response object
   */
  getRes(): ServerResponse {
    return this.raw.raw;
  }

  /**
   * Sets the HTTP status for the response.
   *
   * @param status
   */
  status(status: number) {
    this.raw.code(status);

    return this;
  }

  /**
   * Set `Content-Type` response header with `type` through `mime.lookup()`
   * when it does not contain "/", or set the Content-Type to `type` otherwise.
   *
   * Examples:
   *
   *     res.type('.html');
   *     res.type('html');
   *     res.type('json');
   *     res.type('application/json');
   *     res.type('png');
   */
  contentType(contentType: string) {
    this.raw.type(contentType);

    return this;
  }

  /**
   * Returns the HTTP response header specified by field. The match is case-insensitive.
   *
   * ```typescript
   * response.get('Content-Type') // => "text/plain"
   * ```
   *
   * @param name
   */
  get(name: string) {
    return this.raw.getHeader(name);
  }

  attachment(filename: string) {
    this.setHeader("Content-Disposition", contentDisposition(filename));
    return this;
  }

  setHeader(key: string, item: any) {
    this.raw.header(key, this.formatHeader(key, item));

    return this;
  }

  stream(data: any) {
    this.raw.send(data);

    return this;
  }

  json(data: any) {
    this.raw.send(data);

    return this;
  }
}
