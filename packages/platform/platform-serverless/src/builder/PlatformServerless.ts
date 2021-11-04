import {Env, Type} from "@tsed/core";
import {createContainer, InjectorService, setLoggerLevel} from "@tsed/di";
import {$log, Logger} from "@tsed/logger";
import {getOperationsRoutes, JsonEntityStore} from "@tsed/schema";
import type {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import {ServerlessContext} from "../domain/ServerlessContext";
import {PlatformServerlessHandler} from "./PlatformServerlessHandler";
import {getRequestId} from "../utils/getRequestId";

/**
 * @platform
 */
export class PlatformServerless {
  readonly name: string = "PlatformServerless";

  private _injector: InjectorService;
  private _promise: Promise<void>;

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

    platform.bootstrap(settings);

    return platform;
  }

  public callbacks(tokens: Type | Type[] = [], callbacks: any = {}): Record<string, APIGatewayProxyHandler> {
    callbacks = this.settings
      .get<Type[]>("lambda", [])
      .concat(tokens)
      .reduce((callbacks, token) => {
        const routes = getOperationsRoutes(token);

        return routes.reduce((callbacks, operationRoute) => {
          const {operationId, token, propertyName} = operationRoute;

          return {
            ...callbacks,
            [operationId]: this.callback(token, propertyName)
          };
        }, callbacks);
      }, callbacks);

    return callbacks;
  }

  public callback(token: Type<any>, propertyKey: string): APIGatewayProxyHandler {
    const entity = JsonEntityStore.fromMethod(token, propertyKey);
    let handler: ($ctx: ServerlessContext) => Promise<APIGatewayProxyResult>;

    return async (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>, context: Context) => {
      await this.promise;

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

  public async ready() {
    await this.injector.emit("$onReady");
  }

  public async stop() {
    await this.injector.emit("$onDestroy");
    return this.injector.destroy();
  }

  protected bootstrap(settings: Partial<TsED.Configuration> = {}) {
    this._promise = this.createInjector({
      ...settings,
      PLATFORM_NAME: this.name
    })
      .loadInjector()
      .then(() => this.ready());

    return this;
  }

  protected createInjector(settings: any) {
    this._injector = new InjectorService();
    this.injector.logger = $log;
    this.injector.settings.set(settings);

    if (this.injector.settings.get("env") === Env.TEST && !settings?.logger?.level) {
      $log.stop();
    }

    return this;
  }

  protected async loadInjector() {
    const container = createContainer();

    setLoggerLevel(this.injector);

    await this.injector.emit("$beforeInit");

    await this.injector.load(container);

    await this.injector.emit("$afterInit");
  }
}
