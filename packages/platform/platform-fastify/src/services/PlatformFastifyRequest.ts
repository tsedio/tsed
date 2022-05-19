import {PlatformContext, PlatformRequest} from "@tsed/common";
import {FastifyRequest} from "fastify";
import {IncomingMessage} from "http";

declare module "fastify" {
  export interface FastifyRequest {
    $ctx: PlatformContext;
  }
}

declare module "http" {
  export interface IncomingMessage {
    $ctx: PlatformContext;
  }
}

declare global {
  namespace TsED {
    export interface Request extends FastifyRequest {}
  }
}

/**
 * @platform
 * @fastify
 */
export class PlatformFastifyRequest extends PlatformRequest<FastifyRequest> {
  get host(): string {
    return this.raw.hostname;
  }

  get secure(): boolean {
    return this.protocol === "https";
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
    return this.raw.raw.headers[name.toLowerCase()];
  }

  getReq(): IncomingMessage {
    return this.raw.raw;
  }

  accepts(mime?: string | string[]) {
    const accepts = this.raw.accepts().type([].concat(mime as any));

    return (accepts ? accepts : false) as any;
  }
}
