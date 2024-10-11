import {PlatformResponse} from "@tsed/platform-http";
import {ServerResponse} from "http";
import Koa from "koa";

declare global {
  namespace TsED {
    export interface Response extends Koa.Response {}
  }
}

/**
 * @platform
 * @koa
 */
export class PlatformKoaResponse extends PlatformResponse<Koa.Response> {
  get ctx() {
    return this.raw.ctx;
  }

  get statusCode() {
    return this.raw.status;
  }

  get locals() {
    return this.ctx.state;
  }

  /**
   * Return the Node.js response object
   */
  getRes(): ServerResponse {
    return this.raw.res;
  }

  hasStatus() {
    // KOA set 404 by default
    return this.statusCode !== 404;
  }

  /**
   * Sets the HTTP status for the response.
   *
   * @param status
   */
  status(status: number) {
    this.raw.status = status;

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
    this.raw.type = contentType;

    return this;
  }

  getHeaders() {
    return this.raw.headers;
  }

  stream(data: any) {
    this.raw.body = data;
    return this;
  }

  getBody(): any {
    return this.raw.body;
  }

  cookie(name: string, value: string | null, opts?: TsED.SetCookieOpts) {
    if (value === null) {
      this.ctx.cookies.set(name);
    } else {
      this.ctx.cookies.set(name, value, opts);
    }
    return this;
  }

  protected json(data: any) {
    this.end(data);
    return this;
  }

  protected buffer(data: Buffer) {
    this.end(data);
    return this;
  }

  protected end(data?: string | Buffer) {
    if ([301, 302, 303, 307, 308].includes(this.statusCode)) {
      if (this.request.method === "HEAD") {
        this.getRes().end();
      } else {
        this.getRes().end(data);
      }
    } else {
      this.raw.body = data;
    }
  }
}
