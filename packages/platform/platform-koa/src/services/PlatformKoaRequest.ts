import "@koa/router";
import {IncomingEvent, PlatformContext, PlatformRequest} from "@tsed/common";
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
  #ctx: Koa.Context;

  constructor(event: IncomingEvent, $ctx: PlatformContext) {
    super(event, $ctx);
    this.#ctx = this.raw.ctx;
  }

  get protocol(): string {
    return this.#ctx.request.protocol;
  }

  get host(): string {
    return this.#ctx.request.host;
  }

  get secure(): boolean {
    return this.#ctx.request.secure;
  }

  get cookies(): {[p: string]: any} {
    return this.#ctx.cookie || this.#ctx.cookies;
  }

  get session(): any {
    return this.#ctx.session;
  }

  get route() {
    return this.#ctx._matchedRoute;
  }

  getReq(): IncomingMessage {
    return this.raw.req;
  }

  destroy() {
    // @ts-ignore
    this.#ctx = null;
    return super.destroy();
  }
}
