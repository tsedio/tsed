import fastifyAccepts from "@fastify/accepts";
import fastifyCookie from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import fastifyMiddie from "@fastify/middie";
import {
  createContext,
  createServer,
  PlatformAdapter,
  PlatformBuilder,
  PlatformExceptions,
  PlatformHandlerType,
  PlatformProvider,
  PlatformRequest,
  PlatformResponse,
  runInContext
} from "@tsed/common";
import {isFunction, isString, ReturnHostInfoFromPort, Type} from "@tsed/core";
import {NotFound} from "@tsed/exceptions";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";
import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fastifyRawBody from "fastify-raw-body";
import * as Http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as Https from "https";
import {PlatformFastifyPluginLoadingOptions, PlatformFastifyPluginSettings} from "../interfaces/interfaces";
import {PlatformFastifyRequest} from "../services/PlatformFastifyRequest";
import {PlatformFastifyResponse} from "../services/PlatformFastifyResponse";

declare global {
  namespace TsED {
    export interface Application extends FastifyInstance {}
  }

  namespace TsED {}
}

/**
 * @platform
 * @fastify
 */
@PlatformProvider()
export class PlatformFastify extends PlatformAdapter<FastifyInstance> {
  static readonly NAME = "fastify";

  readonly providers = [
    {
      provide: PlatformResponse,
      useClass: PlatformFastifyResponse
    },
    {
      provide: PlatformRequest,
      useClass: PlatformFastifyRequest
    }
  ];

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

  mapLayers(layers: PlatformLayer[]) {
    const {app} = this;
    const rawApp: FastifyInstance = app.getApp();

    layers.forEach((layer) => {
      switch (layer.method) {
        case "use":
          if ((rawApp as any).use) {
            (rawApp as any).use(...layer.getArgs());
          }
          return;
        case "statics":
          // rawApp.register(this.statics(layer.path as string, layer.opts as any));
          return;
      }
      try {
        rawApp.route({
          method: layer.method.toUpperCase() as any,
          url: layer.path as any,
          handler: this.compose(layer),
          config: {
            rawBody: layer.handlers.some((handler) => handler.opts?.paramsTypes?.RAW_BODY)
          }
        });
      } catch (er) {
        this.injector.logger.warn({
          error_name: er.code,
          error_message: er.message
        });
      }
    });
  }

  mapHandler(handler: Function, metadata: PlatformHandlerMetadata) {
    if (metadata.isRawMiddleware()) {
      return handler;
    }

    switch (metadata.type) {
      case PlatformHandlerType.MIDDLEWARE:
        return (request: IncomingMessage, response: ServerResponse, done: Function) => {
          const {$ctx} = request;

          $ctx.next = done;

          return runInContext($ctx, () => handler($ctx));
        };

      default:
        return (request: FastifyRequest, reply: FastifyReply, done: Function) => {
          const {$ctx} = request;

          $ctx.next = done;

          return runInContext($ctx, () => handler($ctx));
        };
    }
  }

  async useContext() {
    const {app} = this;
    const invoke = createContext(this.injector);
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
      delete ($ctx.request.getReq() as any).$ctx;
      await $ctx.finish();
    });

    await rawApp.register(fastifyMiddie);

    const plugins = await this.resolvePlugins();

    for (const plugin of plugins) {
      // console.log("register", (plugin.use as any)[Symbol.for("plugin-meta")].name, plugin.options)
      await rawApp.register(plugin.use as any, plugin.options);
    }
  }

  createApp() {
    const {app, ...props} = this.injector.settings.get("fastify") || {};
    const httpPort = this.injector.settings.get("httpPort");
    const httpOptions = this.injector.settings.get("httpOptions");
    const httpsPort = this.injector.settings.get("httpsPort");
    const httpsOptions = this.injector.settings.get("httpsOptions");

    const instance: FastifyInstance =
      app ||
      Fastify({
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
      });

    instance.decorateRequest("$ctx", null);
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

      return this.injector.get<PlatformExceptions>(PlatformExceptions)?.catch(error, $ctx);
    });

    rawApp.setNotFoundHandler((request, reply) => {
      const {$ctx} = request;

      return this.injector
        .get<PlatformExceptions>(PlatformExceptions)
        ?.catch(new NotFound(`Resource "${request.originalUrl}" not found`), $ctx);
    });

    return Promise.resolve();
  }

  getServers(): any[] {
    const httpsPort = this.injector.settings.get("httpsPort");
    const httpPort = this.injector.settings.get("httpPort");

    const listen = (hostinfo: ReturnHostInfoFromPort) =>
      this.app.getApp().listen({
        host: hostinfo.address,
        port: hostinfo.port
      });

    const server = () => this.app.getApp().server;

    return [
      createServer(this.injector, {
        port: httpsPort,
        type: "https",
        token: Https.Server,
        server,
        listen
      }),
      createServer(this.injector, {
        port: httpsPort ? null : httpPort,
        type: "http",
        token: Http.Server,
        server,
        listen
      })
    ];
  }

  protected compose(layer: PlatformLayer) {
    return (req: FastifyRequest, reply: FastifyReply) => {
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
      });
    };
  }

  protected async resolvePlugins(): Promise<PlatformFastifyPluginLoadingOptions[]> {
    let plugins = this.injector.settings.get<PlatformFastifyPluginSettings[]>("plugins", []);
    const {env} = this.injector.settings;

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

    return plugins.filter((middleware) => middleware.use).filter((middleware) => middleware.env === env);
  }
}
