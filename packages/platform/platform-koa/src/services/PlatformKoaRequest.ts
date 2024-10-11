import "@koa/router";

import {PlatformContext, PlatformRequest} from "@tsed/platform-http";
import Koa from "koa";

declare module "koa" {
  export interface Request {
    id: string;
    $ctx: PlatformContext;
  }
}

declare global {
  namespace TsED {
    export interface Request extends Koa.Request {}
  }
}

/**
 * @platform
 * @koa
 */
export class PlatformKoaRequest extends PlatformRequest<Koa.Request> {
  get ctx(): Koa.Context {
    return this.$ctx.event.koaContext as Koa.Context;
  }

  get protocol(): string {
    return this.ctx.request.protocol;
  }

  get host(): string {
    return this.ctx.request.host;
  }

  get secure(): boolean {
    return this.ctx.request.secure;
  }

  get cookies(): {[p: string]: any} {
    return this.ctx.cookie || this.ctx.cookies;
  }

  get session(): any {
    return this.ctx.session;
  }

  getReq() {
    return this.ctx.request.req;
  }
}
