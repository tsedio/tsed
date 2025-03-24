import {promisify} from "node:util";

import {injectable} from "@tsed/di";
import type {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fp, {type PluginMetadata} from "fastify-plugin";
import type {IncomingMessage} from "http";
import type {Options} from "multer";

import {MULTER_MODULE, type PlatformMulterFile} from "../../common/index.js";

const kMultipart = Symbol("multipart");

declare module "fastify" {
  export interface FastifyRequest {
    files?: {[key: string]: PlatformMulterFile | PlatformMulterFile[]};
    [kMultipart]: boolean;
  }
}

function setMultipart(req: FastifyRequest, _payload: IncomingMessage, done: (err: Error | null) => void) {
  // nothing to do, it will be done by multer in beforeHandler method
  (req as any)[kMultipart] = true;
  done(null);
}

function fastifyMulter(fastify: FastifyInstance, _options: PluginMetadata, next: (err?: Error) => void) {
  fastify.addContentTypeParser("multipart/form-data", setMultipart);
  next();
}

const multerPlugin = fp(fastifyMulter, {
  fastify: ">= 5.0.0",
  name: "fastify-multer"
});

async function factory() {
  const {default: multer} = await import("multer");

  return {
    multer,
    get(options: Options) {
      const instance = multer(options);

      const makePromise = (multer: any, name: string) => {
        // istanbul ignore next
        if (!multer[name]) return;

        const fn = multer[name];

        multer[name] = function apply(...args: any[]) {
          const middleware: any = Reflect.apply(fn, this, args);

          return async (req: FastifyRequest, res: FastifyReply) => {
            await promisify(middleware)(req.raw, res.raw);
            req.files = (req.raw as any).files;
            req.body = (req.raw as any).body;
          };
        };
      };

      makePromise(instance, "any");
      makePromise(instance, "array");
      makePromise(instance, "fields");
      makePromise(instance, "none");
      makePromise(instance, "single");

      return instance;
    }
  };
}

injectable(MULTER_MODULE)
  .asyncFactory(factory)
  .configuration({
    plugins: [multerPlugin]
  })
  .token();
