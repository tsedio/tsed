import {promisify} from "node:util";

import {injectable} from "@tsed/di";
import Koa from "koa";
import type {Options} from "multer";

import {MULTER_MODULE} from "../../common/index.js";

/**
 * @ignore
 */
function createRawMiddleware(middleware: any) {
  return async (request: Koa.Request) => {
    const ctx: any = request.ctx;

    await middleware(ctx.req, ctx.res);

    const forwardKey = (key: string) => {
      if (ctx.req[key]) {
        ctx.request[key] = ctx.req[key];
        ctx[key] = ctx.req[key];
        delete ctx.req[key];
      }
    };

    if ("request" in ctx) {
      if (ctx.req.body) {
        ctx.request.body = ctx.req.body;
        delete ctx.req.body;
      }

      forwardKey("file");
      forwardKey("files");
    }
  };
}

/**
 * @ignore
 */
function makePromise(multer: any, name: string) {
  // istanbul ignore next
  if (!multer[name]) return;

  const fn = multer[name];

  multer[name] = function apply(...args: any[]) {
    const middleware: any = Reflect.apply(fn, this, args);

    return createRawMiddleware(promisify(middleware));
  };
}

async function factory() {
  const {default: multer} = await import("multer");

  return {
    multer,
    get(options: Options) {
      const instance = multer(options);

      makePromise(instance, "any");
      makePromise(instance, "array");
      makePromise(instance, "fields");
      makePromise(instance, "none");
      makePromise(instance, "single");

      return instance;
    }
  };
}

injectable(MULTER_MODULE).asyncFactory(factory).token();
