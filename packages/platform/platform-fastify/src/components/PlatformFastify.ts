import "@tsed/platform-multer/fastify";
import * as Http from "node:http";
import {IncomingMessage, ServerResponse} from "node:http";
import * as Https from "node:https";
import {$alter, $asyncEmit, hooks} from "@tsed/hooks";
import {type Env, isFunction, isPromise, isString, ReturnHostInfoFromPort, Type} from "@tsed/core";
import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
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
import type {PlatformFastifyPluginLoadingOptions, PlatformFastifyPluginSettings} from "../interfaces/interfaces.js";
import {PlatformHandlerMetadata, PlatformHandlerType, PlatformLayer} from "@tsed/platform-router";
import {constant, inject, logger, runInContext} from "@tsed/di";
import fastifyStatics, {type FastifyStaticOptions} from "@fastify/static";
import {NotFound} from "@tsed/exceptions";
import {PlatformExceptions} from "@tsed/platform-exceptions";
import {PlatformFastifyRequest} from "../services/PlatformFastifyRequest.js";
import {PlatformFastifyResponse} from "../services/PlatformFastifyResponse.js";
import type {PlatformFastifySettings} from "../interfaces/PlatformFastifySettings.js";
import {convertPath} from "../utils/convertPath.js";
import fastifyMiddie from "@fastify/middie";
import {toPrefix} from "../utils/toPrefix.js";

declare global {
  namespace TsED {
    export interface Application extends FastifyInstance {}
  }

  namespace TsED {}
}

/**
 * Finish the request context once the Node.js response ends. Shared by every request: the context is read from
 * the request attached to the response, so no closure is kept alive until the response ends.
 */
function finishContext(this: ServerResponse) {
  const req: any = this.req;
  const $ctx: PlatformContext | undefined = req.$ctx;

  // "error" may follow "finish": the context is finished once
  if (!$ctx) {
    return;
  }

  req.$ctx = undefined;

  $ctx.finish().catch((error) => logger().error({event: "FINISH_ERROR", reqId: $ctx.id, error}));
}

function isRunnable(metadata: PlatformHandlerMetadata, $ctx: PlatformContext) {
  return (
    ($ctx.error && metadata.type === PlatformHandlerType.ERR_MIDDLEWARE) ||
    (!$ctx.error && metadata.type !== PlatformHandlerType.ERR_MIDDLEWARE)
  );
}

/**
 * Run the handlers of a route from `index`, in the same tick while they return a plain value. At the first handler
 * returning a promise, the rest of the handlers runs once it settles.
 */
function runHandlers(handlers: PlatformHandlerMetadata[], $ctx: PlatformContext, index: number): void | Promise<void> {
  for (let i = index; i < handlers.length; i++) {
    const metadata = handlers[i];

    try {
      if (!$ctx.isDone() && isRunnable(metadata, $ctx)) {
        const result = metadata.compiledHandler($ctx);

        if (isPromise(result)) {
          return result.then(
            () => runHandlers(handlers, $ctx, i + 1),
            (er) => {
              $ctx.error = er;

              return runHandlers(handlers, $ctx, i + 1);
            }
          );
        }
      }
    } catch (er) {
      $ctx.error = er;
    }
  }
}

function endRoute($ctx: PlatformContext) {
  if ($ctx.error) {
    // TODO maybe we can use platform exception here?
    throw $ctx.error;
  }

  return $ctx.response.raw;
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
  static create(settings: Partial<TsED.Configuration>): PlatformBuilder<FastifyInstance>;
  static create(module: Type<any>, settings?: Partial<TsED.Configuration>): PlatformBuilder<FastifyInstance>;
  static create(module: Type<any> | Partial<TsED.Configuration>, settings?: Partial<TsED.Configuration>) {
    return new PlatformBuilder<FastifyInstance>({
      httpsPort: false,
      httpPort: false,
      ...PlatformBuilder.options(PlatformFastify, module, settings)
    });
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static bootstrap(settings: Partial<TsED.Configuration>): Promise<PlatformBuilder<FastifyInstance>>;
  static bootstrap(module: Type<any>, settings?: Partial<TsED.Configuration>): Promise<PlatformBuilder<FastifyInstance>>;
  static bootstrap(module: Type<any> | Partial<TsED.Configuration>, settings?: Partial<TsED.Configuration>) {
    return new PlatformBuilder<FastifyInstance>(PlatformBuilder.options(PlatformFastify, module, settings)).bootstrap();
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

    // done is called in the same tick when the handler is synchronous. As before, an error is returned as a
    // rejected promise and done is not called.
    const run = ($ctx: PlatformContext, then: (result: unknown) => unknown) => {
      let result: unknown;

      try {
        result = runInContext($ctx, () => handler($ctx));
      } catch (er) {
        return Promise.reject(er);
      }

      return isPromise(result) ? result.then(then) : then(result);
    };

    switch (metadata.type) {
      case PlatformHandlerType.MIDDLEWARE:
        return (request: IncomingMessage, _: ServerResponse, done: (err?: any) => void) => {
          const {$ctx} = request;

          $ctx.next = done;

          return run($ctx, (result) => {
            callNext(done, metadata, $ctx);

            return result;
          });
        };

      default:
        return (request: FastifyRequest, _: FastifyReply, done: (err?: any) => void) => {
          const {$ctx} = request;

          $ctx.next = done;

          return run($ctx, () => {
            if (metadata.type === PlatformHandlerType.CTX_FN) {
              done();
            }
          });
        };
    }
  }

  async useContext() {
    const {app} = this;
    const invoke = createContext();
    const rawApp: FastifyInstance = app.getApp();

    // Callback hooks: Fastify continues synchronously when no $onRequest listener has to be awaited.
    rawApp.addHook("onRequest", (request, reply, done) => {
      const $ctx = invoke({
        request: request as any,
        response: reply as any
      });

      (request.raw as any).$ctx = $ctx;

      // Listen on the Node.js response instead of a Fastify onResponse hook: without onResponse hook
      // (and without Fastify logger), Fastify skips its own response listeners and hook runner.
      reply.raw.on("finish", finishContext);
      reply.raw.on("error", finishContext);

      if (!hooks.has("$onRequest")) {
        return done();
      }

      $ctx.start().then(() => done(), done);
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
      routerOptions: {
        ...props?.routerOptions,
        ignoreTrailingSlash: true
      },
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

      return runInContext(req.$ctx, () => {
        const $ctx = req.$ctx;
        $ctx.next = null;

        const result = runHandlers(layer.handlers, $ctx, 0);

        if (isPromise(result)) {
          return result.then(() => endRoute($ctx));
        }

        const raw = endRoute($ctx);

        // returning undefined once the reply is sent keeps Fastify off its promise path. A reply still in flight
        // (e.g. an async onSend hook) is returned in a promise, as before.
        return raw.sent ? undefined : Promise.resolve(raw);
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
