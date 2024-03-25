import {Env, Type} from "@tsed/core";
import {createContainer, InjectorService, setLoggerConfiguration} from "@tsed/di";
import {$log, Logger} from "@tsed/logger";
import {JsonEntityStore} from "@tsed/schema";
import {APIGatewayProxyResult} from "aws-lambda";
import {PlatformContext} from "../domain/PlatformContext";
import {PlatformContextOpts} from "../domain/PlatformContextOpts";
import {PlatformHandler} from "./PlatformHandler";

export interface PlatformBuilderOptions extends TsED.Configuration {

}

/**
 * @platform
 */
export class PlatformBuilder {
  static PlatformContext: typeof PlatformContext = PlatformContext;
  readonly name: string = "PlatformFunction";
  #injector: InjectorService;
  #promise: Promise<any>;

  get injector(): InjectorService {
    return this.#injector;
  }

  get settings() {
    return this.injector.settings;
  }

  get promise() {
    return this.#promise;
  }

  static bootstrap(settings: PlatformBuilderOptions): PlatformBuilder {
    const platform = new PlatformBuilder();
    platform.createInjector(settings);


    return platform;
  }


  public async ready() {
    await this.injector.emit("$onReady");
  }

  public async stop() {
    await this.injector.emit("$onDestroy");
    return this.injector.destroy();
  }

  public init() {
    if (!this.#promise) {
      this.#promise = this.loadInjector().then(() => this.ready());
    }

    return this.#promise;
  }

  protected handler<Opts extends PlatformContextOpts = PlatformContextOpts>(token: Type<any>, propertyKey: string) {
    const entity = JsonEntityStore.fromMethod(token, propertyKey);
    let handler: ($ctx: PlatformContext) => Promise<PlatformContext>;

    return async (options: Opts) => {
      await this.init();

      if (!handler) {
        const platformHandler = this.injector.get<PlatformHandler>(PlatformHandler)!;
        handler = await platformHandler.createHandler(token, propertyKey);
      }

      const $ctx = new (PlatformBuilder.PlatformContext)({
        ...options,
        logger: this.injector.logger as Logger,
        injector: this.injector,
        handler: entity
      });

      return handler($ctx);
    };
  }

  protected createInjector(settings: any) {
    this.#injector = new InjectorService();
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
