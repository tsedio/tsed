import Koa from "koa";
import {promisify} from "util";

let multerModule: any;
import("multer").then(({default: m}) => (multerModule = m));

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

/**
 * @ignore
 */
export function multerMiddleware(options: any) {
  const m = multerModule(options);

  makePromise(m, "any");
  makePromise(m, "array");
  makePromise(m, "fields");
  makePromise(m, "none");
  makePromise(m, "single");

  return m;
}
