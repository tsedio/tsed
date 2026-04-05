import "@tsed/platform-multer/fastify";

import * as Http from "node:http";
import {IncomingMessage, ServerResponse} from "node:http";
import * as Https from "node:https";

import fastifyMiddie from "@fastify/middie";
import fastifyStatics, {type FastifyStaticOptions} from "@fastify/static";
import {type Env, isFunction, isString, ReturnHostInfoFromPort, Type} from "@tsed/core";
import {constant, inject, logger, runInContext} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {$alter, $asyncEmit} from "@tsed/hooks";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {
  adapter,
  createContext,
  createServer,
  PlatformAdapter,
  PlatformBuilder,
  PlatformContext,
  PlatformRequest,
  PlatformResponse,
  PlatformStaticsOptions
} from "@tsed/platform-http";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

import type {PlatformFastifyPluginLoadingOptions, PlatformFastifyPluginSettings} from "../interfaces/interfaces.js";
import type {PlatformFastifySettings} from "../interfaces/PlatformFastifySettings.js";
import {PlatformFastifyRequest} from "../services/PlatformFastifyRequest.js";
import {PlatformFastifyResponse} from "../services/PlatformFastifyResponse.js";
import {convertPath} from "../utils/convertPath.js";
import {toPrefix} from "../utils/toPrefix.js";

declare global {
  namespace TsED {
    export interface Application extends FastifyInstance {}
  }

  namespace TsED {}
}

function callNext(next: any, metadata: PlatformHandlerMetadata, $ctx: PlatformContext) {
  if (metadata.type !== PlatformHandlerType.RESPONSE_FN) {
    return next && $ctx.error && !$ctx.isDone() ? next($ctx.error) : next();
  }
}

export class PlatformFastify extends PlatformAdapter<FastifyInstance> {
  readonly NAME = "fastify";
  private staticsDecorated = false;

  /**
   * Create new serverless application. In this mode, the component scan are disabled.
   * @param module
   * @param settings
   */
  static create(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.create<FastifyInstance>(module, {
      ...settings,
      adapter: PlatformFastify
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    return PlatformBuilder.bootstrap<FastifyInstance>(module, {
      ...settings,
      adapter: PlatformFastify
    });
  }

  async mapLayers(layers: PlatformLayer[]) {
    const {app} = this;
    const rawApp: FastifyInstance = app.getApp();

    for (const layer of layers) {
      const {path, wildcard} = convertPath(layer.path);
      const handlers = layer.getArgs(false);

      switch (layer.method) {
        case "use":
          if ((rawApp as any).use) {
            (rawApp as any).use(path, handlers);
          }
          continue;
        case "statics":
          await this.statics(path as string, layer.opts as any);
          continue;
      }

      try {
        rawApp.route({
          method: layer.method.toUpperCase() as any,
          url: path as any,
          handler: this.compose(layer, wildcard),
          config: {
            rawBody: layer.handlers.some((handler) => handler.opts?.paramsTypes?.RAW_BODY)
          }
        });
      } catch (er) {
        const error = er as {code?: string; message?: string};
        logger().warn({
          error_name: error.code,
          error_message: error.message
        });
      }
    }
  }

  mapHandler(handler: (...args: any[]) => any, metadata: PlatformHandlerMetadata) {
    if (metadata.isRawMiddleware()) {
      return handler;
    }

    switch (metadata.type) {
      case PlatformHandlerType.MIDDLEWARE:
        return async (request: IncomingMessage, _: ServerResponse, done: (err?: any) => void) => {
          const {$ctx} = request;

          $ctx.next = done;

          const result = await runInContext($ctx, () => handler($ctx));

          callNext(done, metadata, $ctx);

          return result;
        };

      default:
        return async (request: FastifyRequest, _: FastifyReply, done: (err?: any) => void) => {
          const {$ctx} = request;

          $ctx.next = done;

          await runInContext($ctx, () => handler($ctx));

          if (metadata.type === PlatformHandlerType.CTX_FN) {
            done();
          }
        };
    }
  }

  async useContext() {
    const {app} = this;
    const invoke = createContext();
    const rawApp: FastifyInstance = app.getApp();

    rawApp.addHook("onRequest", async (request, reply) => {
      const $ctx = invoke({
        request: request as any,
        response: reply as any
      });

      ($ctx.request.getReq() as any).$ctx = $ctx;

      await $ctx.start();
    });

    rawApp.addHook("onResponse", async (request, reply) => {
      const {$ctx} = request;
      ($ctx.request.getReq() as any).$ctx = undefined;
      await $ctx.finish();
    });

    await rawApp.register(fastifyMiddie, {
      hook: "onRequest"
    });

    const plugins = await this.resolvePlugins();

    for (const plugin of plugins) {
      await rawApp.register(plugin.use as any, plugin.options!);
    }
  }

  createApp() {
    const {app, ...props} = constant<PlatformFastifySettings>("fastify") || {};
    const httpPort = constant<number | false>("httpPort");
    const httpOptions = constant<Http.ServerOptions>("httpOptions");
    const httpsPort = constant<number | false>("httpsPort");
    const httpsOptions = constant<Https.ServerOptions>("httpsOptions");
    const opts = {
      ...props,
      ignoreTrailingSlash: true,
      http:
        httpPort !== false
          ? {
              ...httpOptions
            }
          : null,
      https:
        httpsPort !== false
          ? {
              ...httpsOptions
            }
          : null
    };

    const instance: FastifyInstance = app || Fastify(opts);

    instance.decorateRequest("$ctx", null as never);
    instance.decorateReply("locals", null);

    return {
      app: instance,
      callback: () => {
        return async (request: IncomingMessage, response: ServerResponse) => {
          await instance.ready();
          instance.server.emit("request", request, response);
        };
      }
    };
  }

  afterLoadRoutes() {
    const rawApp: FastifyInstance = this.app.getApp();

    rawApp.setErrorHandler((error, request, reply) => {
      const {$ctx} = request;
      $ctx.error = $ctx.error || error;

      return inject<PlatformExceptions>(PlatformExceptions)?.catch(error, $ctx);
    });

    rawApp.setNotFoundHandler((request, reply) => {
      const {$ctx} = request;

      return inject<PlatformExceptions>(PlatformExceptions)?.catch(new NotFound(`Resource "${request.originalUrl}" not found`), $ctx);
    });

    return Promise.resolve();
  }

  getServers(): any[] {
    const httpsPort = constant<string | false>("httpsPort");
    const httpPort = constant<string | false>("httpPort");

    const listen = (hostinfo: ReturnHostInfoFromPort) =>
      this.app.getApp().listen({
        host: hostinfo.address,
        port: hostinfo.port
      });

    const server = () => this.app.getApp().server;

    return [
      createServer({
        port: httpsPort,
        type: "https",
        token: Https.Server,
        server,
        listen
      }),
      createServer({
        port: httpPort,
        type: "http",
        token: Http.Server,
        server,
        listen
      })
    ];
  }

  bodyParser(type: string, opts: Record<string, any> | undefined): any {
    return null;
  }

  async statics(endpoint: string, options: PlatformStaticsOptions & FastifyStaticOptions): Promise<void> {
    options = {
      prefix: toPrefix(endpoint),
      ...options,
      decorateReply: !this.staticsDecorated
    };

    await this.app.getApp().register(fastifyStatics, options);

    this.staticsDecorated = true;

    await $asyncEmit("$staticsMounted", [endpoint, options]);
  }

  protected compose(layer: PlatformLayer, wildcard?: string) {
    return (req: FastifyRequest, _: FastifyReply) => {
      const params = req.params as Record<string, any>;

      if (wildcard && params["*"] && !params[wildcard]) {
        params[wildcard] = params["*"];
      }

      return runInContext(req.$ctx, async () => {
        const $ctx = req.$ctx;
        $ctx.next = null;

        for (const metadata of layer.handlers) {
          try {
            if (!req.$ctx.isDone()) {
              if (
                ($ctx.error && metadata.type === PlatformHandlerType.ERR_MIDDLEWARE) ||
                (!$ctx.error && metadata.type !== PlatformHandlerType.ERR_MIDDLEWARE)
              ) {
                await metadata.compiledHandler($ctx);
              }
            }
          } catch (er) {
            $ctx.error = er;
          }
        }

        if (req.$ctx.error) {
          // TODO maybe we can use platform exception here?
          throw req.$ctx.error;
        }

        return $ctx.response.raw;
      });
    };
  }

  protected async resolvePlugins(): Promise<PlatformFastifyPluginLoadingOptions[]> {
    let plugins = constant<PlatformFastifyPluginSettings[]>("plugins", []);
    const env = constant<Env>("env");

    const promises = plugins.map(async (plugin: PlatformFastifyPluginSettings): Promise<PlatformFastifyPluginLoadingOptions> => {
      if (isFunction(plugin)) {
        return {
          env,
          use: plugin
        };
      }

      if (isString(plugin)) {
        plugin = {env, use: plugin};
      }

      let {use} = plugin;

      if (isString(use)) {
        const mod = await import(use);
        use = mod.default || mod;
      }

      return {
        env,
        ...plugin,
        use
      };
    });

    plugins = await Promise.all(promises);

    return $alter(
      "$afterPlugins",
      plugins.filter((plugin) => plugin.use).filter((plugin) => plugin.env === env)
    );
  }
}

adapter(PlatformFastify, [
  {
    token: PlatformResponse,
    useClass: PlatformFastifyResponse
  },
  {
    token: PlatformRequest,
    useClass: PlatformFastifyRequest
  }
]);
