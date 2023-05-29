import {Env, Type} from "@tsed/core";
import {createContainer, InjectorService, setLoggerConfiguration} from "@tsed/di";
import {$log, Logger} from "@tsed/logger";
import {getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import type {APIGatewayProxyResult, Handler} from "aws-lambda";
import type {HTTPMethod, Instance} from "find-my-way";
import {ServerlessContext} from "../domain/ServerlessContext";
import {getRequestId} from "../utils/getRequestId";
import {PlatformServerlessHandler} from "./PlatformServerlessHandler";

export interface PlatformServerlessSettings extends Partial<TsED.Configuration> {
  lambda?: Type[];
}

/**
 * @platform
 */
export class PlatformServerless {
  readonly name: string = "PlatformServerless";

  private _injector: InjectorService;
  private _router: Instance<any>;
  private _promise: Promise<any>;

  get injector(): InjectorService {
    return this._injector;
  }

  get settings() {
    return this.injector.settings;
  }

  get promise() {
    return this._promise;
  }

  static bootstrap(settings: Partial<TsED.Configuration> & {lambda?: Type[]} = {}): PlatformServerless {
    const platform = new PlatformServerless();
    platform.createInjector(settings);

    return platform;
  }

  public handler(): Handler {
    return async (event, context) => {
      const [router] = await Promise.all([this.initRouter(), this.init()]);
      const result = router.find(event.httpMethod as any, event.path);

      if (result) {
        const {handler, params} = result;

        event.pathParameters = {
          ...(event.pathParameters || {}),
          ...params
        };

        return (handler as any)(event, context);
      }

      return {
        statusCode: 404,
        body: "Not found",
        headers: {
          "x-request-id": getRequestId(event, context)
        },
        isBase64Encoded: false
      };
    };
  }

  public callbacks(tokens: Type | Type[] = [], callbacks: any = {}): Record<string, Handler> {
    return this.settings
      .get<Type[]>("lambda", [])
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
    await this.injector.emit("$onReady");
  }

  public async stop() {
    await this.injector.emit("$onDestroy");
    return this.injector.destroy();
  }

  public init() {
    if (!this._promise) {
      this._promise = this.loadInjector().then(() => this.ready());
    }

    return this._promise;
  }

  protected callback(token: Type<any>, propertyKey: string): Handler {
    const entity = JsonEntityStore.fromMethod(token, propertyKey);
    let handler: ($ctx: ServerlessContext) => Promise<APIGatewayProxyResult>;

    return async (event, context) => {
      await this.init();

      if (!handler) {
        const platformHandler = this.injector.get<PlatformServerlessHandler>(PlatformServerlessHandler)!;
        handler = await platformHandler.createHandler(token, propertyKey);
      }

      const $ctx = new ServerlessContext({
        event,
        context,
        id: getRequestId(event, context),
        logger: this.injector.logger as Logger,
        injector: this.injector,
        endpoint: entity
      });

      return handler($ctx);
    };
  }

  protected async initRouter() {
    if (!this._router) {
      const {default: FindMyMay} = await import("find-my-way");

      this._router = FindMyMay({caseSensitive: false, ignoreTrailingSlash: true});

      this.callbacks();
    }

    return this._router;
  }

  protected createInjector(settings: any) {
    this._injector = new InjectorService();
    this.injector.logger = $log;
    this.injector.settings.set(settings);

    // istanbul ignore next
    if (this.injector.settings.get("env") === Env.TEST && !settings?.logger?.level) {
      $log.stop();
    }

    return this;
  }

  protected async loadInjector() {
    const container = createContainer();

    setLoggerConfiguration(this.injector);

    await this.injector.emit("$beforeInit");

    await this.injector.load(container);

    await this.injector.emit("$afterInit");
  }
}
