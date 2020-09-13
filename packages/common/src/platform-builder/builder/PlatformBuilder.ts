import {classOf, constructorOf, Type} from "@tsed/core";
import {Container, InjectorService, IProvider} from "@tsed/di";
import {
  GlobalAcceptMimesMiddleware,
  IRoute,
  Platform,
  PlatformApplication,
  PlatformHandler,
  PlatformRequest,
  PlatformResponse,
  PlatformRouter
} from "../../platform";
import {PlatformLogMiddleware} from "../../platform/middlewares/PlatformLogMiddleware";
import {
  callHook,
  createContainer,
  createHttpServer,
  createHttpsServer,
  createInjector,
  createPlatformApplication,
  getConfiguration,
  importProviders,
  listenHttpServer,
  listenHttpsServer,
  loadInjector,
  printRoutes,
  setLoggerLevel
} from "../utils";

export interface PlatformType<T = any> extends Type<T> {
  providers: IProvider[];
}

/**
 * @platform
 */
export abstract class PlatformBuilder {
  protected startedAt = new Date();
  protected _rootModule: any;
  protected _injector: InjectorService;
  protected locals: Container;

  constructor() {
    this.locals = new Container()
      .add(PlatformHandler)
      .add(PlatformResponse)
      .add(PlatformRequest)
      .add(PlatformRouter)
      .add(PlatformApplication)
      .add(Platform);
  }

  get injector(): InjectorService {
    return this._injector;
  }

  get rootModule(): any {
    return this._rootModule;
  }

  get app(): PlatformApplication {
    return this.injector.get<PlatformApplication>(PlatformApplication)!;
  }

  get platform() {
    return this.injector.get<Platform>(Platform)!;
  }

  /**
   * Return the settings configured by the decorator @@Configuration@@.
   *
   * ```typescript
   * @Configuration({
   *    rootDir: Path.resolve(__dirname),
   *    port: 8000,
   *    httpsPort: 8080,
   *    mount: {
   *      "/rest": "${rootDir}/controllers/**\/*.js"
   *    }
   * })
   * export class Server {
   *     $onInit(){
   *         console.log(this.settings); // {rootDir, port, httpsPort,...}
   *     }
   * }
   * ```
   *
   * @returns {PlatformConfiguration}
   */
  get settings() {
    return this.injector.settings;
  }

  get logger() {
    return this.injector.logger;
  }

  static build<T extends PlatformBuilder>(platformBuildClass: PlatformType<T>): T {
    const platform = new platformBuildClass();

    return platform.useProviders(platformBuildClass.providers || []);
  }

  /**
   * Add classes to the components list
   * @param classes
   */
  public addComponents(classes: any | any[]) {
    this.settings.componentsScan = this.settings.componentsScan.concat(classes);

    return this;
  }

  /**
   * Add classes decorated by @@Controller@@ to components container.
   *
   * ### Example
   *
   * ```typescript
   * @Controller('/ctrl')
   * class MyController{
   * }
   *
   * platform.addControllers('/rest', [MyController])
   * ```
   *
   * ::: tip
   * If the MyController class isn't decorated, the class will be ignored.
   * :::
   *
   * @param {string} endpoint
   * @param {any[]} controllers
   */
  public addControllers(endpoint: string, controllers: any | string | (any | string)[]) {
    this.settings.mount[endpoint] = (this.settings.mount[endpoint] || []).concat(controllers);
  }

  public async runLifecycle() {
    setLoggerLevel(this.injector);

    const routes = await importProviders(this.injector);

    await this.loadInjector();
    await this.loadRoutes(routes);
    await this.logRoutes();
  }

  async loadInjector() {
    const {injector, logger} = this;
    await this.callHook("$beforeInit");

    logger.info("Build providers");

    await loadInjector(injector, createContainer(constructorOf(this.rootModule)));

    logger.debug("Settings and injector loaded");
    await this.callHook("$afterInit");
  }

  async listen() {
    const {logger, startedAt} = this;
    await this.callHook("$beforeListen");

    await this.listenServers();

    await this.callHook("$afterListen");

    await this.ready();
    logger.info(`Started in ${new Date().getTime() - startedAt.getTime()} ms`);
  }

  public async ready() {
    await this.callHook("$onReady");
    await this.injector.emit("$onServerReady");
  }

  callHook(key: string, ...args: any[]) {
    return callHook(this.injector, this.rootModule, key, ...args);
  }

  async loadStatics(): Promise<void> {
    const {settings} = this;

    if (settings.statics) {
      Object.entries(settings.statics).forEach(([path, items]) => {
        [].concat(items as any).forEach((options) => {
          const opts =
            typeof options === "string"
              ? {
                  root: options
                }
              : options;

          this.platform.app.statics(path, opts);
        });
      });
    }
  }

  useProvider(token: Type<any>, settings: Partial<IProvider>) {
    if (this.locals.hasProvider(token)) {
      Object.assign(this.locals.getProvider(token), settings);
    } else {
      this.locals.addProvider(token, settings);
    }

    return this;
  }

  useProviders(providers: IProvider<any>[]) {
    providers.forEach(({provide, ...settings}) => {
      this.useProvider(provide, settings);
    });

    return this;
  }

  protected async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    this.createInjector(module, settings);
    this.createRootModule(module);

    await this.runLifecycle();

    return this;
  }

  protected async listenServers(): Promise<void> {
    await Promise.all([listenHttpServer(this.injector), listenHttpsServer(this.injector)]);
  }

  protected logRoutes() {
    const {logger, platform} = this;

    if (!this.settings.logger.disableRoutesSummary) {
      logger.info("Routes mounted :");
      logger.info(printRoutes(platform.getRoutes()));
    }
  }

  protected async loadRoutes(routes: IRoute[]) {
    const {logger, platform} = this;

    // istanbul ignore next
    if (this.settings.logger.level !== "off") {
      this.app.use(PlatformLogMiddleware);
    }

    if (this.settings.acceptMimes?.length) {
      this.app.use(GlobalAcceptMimesMiddleware);
    }

    logger.info("Load routes");
    await this.callHook("$beforeRoutesInit"); // deprecated

    platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");

    await this.loadStatics();

    await this.callHook("$afterRoutesInit");
  }

  protected createInjector(module: Type<any>, settings: any) {
    this._injector = createInjector(getConfiguration(module, settings));

    // configure locals providers
    this.locals.forEach((provider) => {
      this.injector.addProvider(provider.token, provider);
    });

    createPlatformApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);
  }

  protected createRootModule(module: Type<any>) {
    this._rootModule = this.injector.invoke(module);

    this.injector.delete(constructorOf(this._rootModule));
    this.injector.delete(classOf(this._rootModule));
  }
}
