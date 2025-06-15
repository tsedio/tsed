import {Env, Type} from "@tsed/core";
import {configuration, constant, createContainer, destroyInjector, inject, injector, setLoggerConfiguration} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {$log} from "@tsed/logger";
import type {RequestHandler} from "@tsed/platform-serverless";
import {getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import type {HTTPMethod, Instance} from "find-my-way";

import {GCPContext} from "../domain/GCPContext.js";
import type {GCPBackgroundEvent, GCPEvent, GCPRequestHandler, RawGCPContext, RawGPCRequest, RawGPCResponse} from "../domain/GCPEvent.js";
import {getRequestId} from "../utils/getRequestId.js";
import {PlatformGCPHandler} from "./PlatformGCPHandler.js";

export interface PlatformGCPSettings extends Partial<TsED.Configuration> {
  functions?: Type[];
}

/**
 * @platform
 */
export class PlatformGCP {
  readonly name: string = "PlatformGCP";
  #router: Instance<any>;
  #promise: Promise<any>;

  get promise() {
    return this.#promise;
  }

  static bootstrap(settings: Partial<TsED.Configuration> & {functions?: Type[]} = {}): PlatformGCP {
    const platform = new PlatformGCP();
    platform.createInjector(settings);

    return platform;
  }

  /**
   * Create a new handler from the given token and propertyKey. No routing is used here.
   */
  static callback(token: Type<any>, propertyKey: string, settings: Partial<TsED.Configuration> = {}): GCPRequestHandler {
    const platform = PlatformGCP.bootstrap({
      ...settings,
      functions: [token]
    });

    return platform.callback(token, propertyKey);
  }

  public handler() {
    return async (event: GCPEvent, context?: any) => {
      const [router] = await Promise.all([this.initRouter(), this.init()]);

      // For HTTP events, use the router to find the handler
      if ("req" in event && "res" in event) {
        const {req} = event;
        const result = router.find(req.method as any, req.path);

        if (result) {
          const {handler, params} = result;
          req.params = {
            ...(req.params || {}),
            ...params
          };

          return (handler as any)(event, context);
        }

        // Not found
        event.res.status(404).send("Not found");
        return;
      }

      // For background events, we don't use routing
      // The handler should be set up using the callback method
      return {
        statusCode: 404,
        body: "Not found",
        headers: {
          "x-request-id": getRequestId(event)
        }
      };
    };
  }

  public callbacks(tokens: Type | Type[] = [], callbacks: any = {}): Record<string, RequestHandler> {
    return configuration()
      .get<Type[]>("functions", [])
      .concat(tokens)
      .reduce((callbacks, token) => {
        const routes = getOperationsRoutes(token);

        return routes.reduce((callbacks, operationRoute) => {
          const {operationId, token, propertyName, method, url} = operationRoute;

          // istanbul ignore next
          if (method === "USE") {
            return callbacks;
          }

          const callback = this.callback(token, propertyName);

          this.#router?.on(method as HTTPMethod, url as string, callback as any);

          return {
            ...callbacks,
            [operationId]: callback
          };
        }, callbacks);
      }, callbacks);
  }

  public async ready() {
    await $asyncEmit("$onReady");
  }

  public async stop() {
    await destroyInjector();
  }

  public init() {
    if (!this.#promise) {
      this.#promise = this.loadInjector().then(() => this.ready());
    }

    return this.#promise;
  }

  protected callback(token: Type<any>, propertyKey: string): GCPRequestHandler {
    const entity = JsonEntityStore.fromMethod(token, propertyKey);
    let handler: ($ctx: GCPContext) => Promise<unknown>;

    return async (reqOrEvent: RawGPCRequest | GCPBackgroundEvent, resOrContext: RawGPCResponse | RawGCPContext) => {
      const event =
        "headers" in reqOrEvent
          ? {
              event: {
                req: reqOrEvent,
                res: resOrContext
              },
              context: {}
            }
          : ({
              event: reqOrEvent,
              context: resOrContext
            } as GCPEvent);

      await this.init();

      if (!handler) {
        const platformHandler = inject(PlatformGCPHandler)!;
        handler = platformHandler.createHandler(token, propertyKey);
      }

      const $ctx = new GCPContext({
        event,
        id: getRequestId(event),
        endpoint: entity
      });

      return handler($ctx);
    };
  }

  protected async initRouter() {
    if (!this.#router) {
      const {default: FindMyMay} = await import("find-my-way");

      this.#router = FindMyMay({
        caseSensitive: false,
        ignoreTrailingSlash: true
      });

      this.callbacks();
    }

    return this.#router;
  }

  protected createInjector(settings: any) {
    injector().logger = $log;
    injector().settings.set(settings);

    // istanbul ignore next
    if (constant("env") === Env.TEST && !settings?.logger?.level) {
      $log.stop();
    }

    return this;
  }

  protected async loadInjector() {
    const container = createContainer();

    setLoggerConfiguration();

    await injector().load(container);

    await $asyncEmit("$afterInit");
  }
}
