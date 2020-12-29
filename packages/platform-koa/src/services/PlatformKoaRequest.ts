import "@koa/router";
import {PlatformContext, PlatformRequest} from "@tsed/common";
import {IncomingMessage} from "http";
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
  get secure(): boolean {
    return this.raw.ctx.request.secure;
  }

  get cookies(): {[p: string]: any} {
    return this.raw.ctx.cookie || this.raw.ctx.cookies;
  }

  get session(): any {
    return this.raw.ctx.session;
  }

  getReq(): IncomingMessage {
    return this.raw.req;
  }
}
