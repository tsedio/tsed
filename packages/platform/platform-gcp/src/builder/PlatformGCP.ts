import {Env, Type} from "@tsed/core";
import {configuration, constant, createContainer, destroyInjector, injector, InjectorService, setLoggerConfiguration} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {$log} from "@tsed/logger";
import {getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import type {HTTPMethod, Instance} from "find-my-way";

import {GCPContext} from "../domain/GCPContext.js";
import type {GCPEvent} from "../domain/GCPEvent.js";
import {GCPResponseStream, type RequestHandler} from "../domain/GCPResponseStream.js";
import {getRequestId} from "../utils/getRequestId.js";
import {PlatformGCPHandler} from "./PlatformGCPHandler.js";

export interface PlatformGCPSettings extends Partial<TsED.Configuration> {
  gcpFunctions?: Type[];
}

/**
 * @platform
 */
export class PlatformGCP {
  readonly name: string = "PlatformGCP";
  private _router: Instance<any>;
  private _promise: Promise<any>;

  get injector(): InjectorService {
    return injector();
  }

  get settings() {
    return configuration();
  }

  get promise() {
    return this._promise;
  }

  static bootstrap(settings: Partial<TsED.Configuration> & {gcpFunctions?: Type[]} = {}): PlatformGCP {
    const platform = new PlatformGCP();
    platform.createInjector(settings);

    return platform;
  }

  /**
   * Create a new handler from the given token and propertyKey. No routing is used here.
   */
  static callback(token: Type<any>, propertyKey: string, settings: Partial<TsED.Configuration> = {}): RequestHandler {
    const platform = PlatformGCP.bootstrap({
      ...settings,
      gcpFunctions: [token]
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
      .get<Type[]>("gcpFunctions", [])
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

          this._router?.on(method as HTTPMethod, url as string, callback as any);

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
    if (!this._promise) {
      this._promise = this.loadInjector().then(() => this.ready());
    }

    return this._promise;
  }

  protected callback(token: Type<any>, propertyKey: string): RequestHandler {
    const entity = JsonEntityStore.fromMethod(token, propertyKey);
    let handler: ($ctx: GCPContext) => Promise<unknown>;

    const wrappedHandler = async (event: GCPEvent, responseStream: GCPResponseStream | undefined, context?: any) => {
      await this.init();

      if (!handler) {
        const platformHandler = this.injector.get<PlatformGCPHandler>(PlatformGCPHandler)!;
        handler = platformHandler.createHandler(token, propertyKey);
      }

      const $ctx = new GCPContext({
        event,
        responseStream,
        id: getRequestId(event, context),
        endpoint: entity
      });

      return handler($ctx);
    };

    const isBinary = entity.operation.response?.isBinary();

    if (isBinary) {
      return GCPResponseStream.streamifyResponse(wrappedHandler);
    }

    return (event: GCPEvent, context?: any) => {
      return wrappedHandler(event, undefined, context);
    };
  }

  protected async initRouter() {
    if (!this._router) {
      const {default: FindMyMay} = await import("find-my-way");

      this._router = FindMyMay({
        caseSensitive: false,
        ignoreTrailingSlash: true
      });

      this.callbacks();
    }

    return this._router;
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
