import {classOf, constructorOf, isFunction, nameOf, Type} from "@tsed/core";
import {Container, createContainer, getConfiguration, InjectorService, IProvider, setLoggerLevel} from "@tsed/di";
import {PlatformMiddlewareLoadingOptions} from "../../config/interfaces";
import {IRoute} from "../interfaces/IRoute";
import {GlobalAcceptMimesMiddleware} from "../middlewares";
import {PlatformLogMiddleware} from "../middlewares/PlatformLogMiddleware";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {PlatformRouter} from "../services/PlatformRouter";
import {
  callHook,
  createHttpServer,
  createHttpsServer,
  createInjector,
  createPlatformApplication,
  importRoutes,
  listenHttpServer,
  listenHttpsServer,
  loadInjector,
  printRoutes
} from "../utils";

/**
 * @ignore
 */
export interface PlatformType<T = any> extends Type<T> {
  providers: IProvider[];
}

/**
 * @ignore
 */
export interface PlatformBootstrap {
  bootstrap(module: Type<any>, settings?: Partial<TsED.Configuration>): Promise<PlatformBuilder>;
}

/**
 * @platform
 */
export abstract class PlatformBuilder<App = TsED.Application, Router = TsED.Router> {
  static currentPlatform: Type<PlatformBuilder> & PlatformBootstrap;
  protected startedAt = new Date();
  protected PLATFORM_NAME: string = "";
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

  get name() {
    return this.PLATFORM_NAME;
  }

  get injector(): InjectorService {
    return this._injector;
  }

  get rootModule(): any {
    return this._rootModule;
  }

  get app(): PlatformApplication<App, Router> {
    return this.injector.get<PlatformApplication<App, Router>>(PlatformApplication)!;
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

  get disableBootstrapLog() {
    return this.settings.logger.disableBootstrapLog;
  }

  log(...data: any[]) {
    return this.disableBootstrapLog && this.logger.info(...data);
  }

  static build<T extends PlatformBuilder<any, any>>(platformBuildClass: PlatformType<T>): T {
    const platform = new platformBuildClass();
    platform.PLATFORM_NAME = nameOf(platformBuildClass).replace("Platform", "").toLowerCase();

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

    const routes = await importRoutes(this.injector);

    await this.loadInjector();

    this.useContext();
    this.useRouter();

    await this.loadRoutes(routes);
    await this.logRoutes();
  }

  async loadInjector() {
    const {injector, logger} = this;
    await this.callHook("$beforeInit");
    this.loadMiddlewaresFor("$beforeInit");

    this.log("Build providers");

    await loadInjector(injector, createContainer(constructorOf(this.rootModule)));

    this.log("Settings and injector loaded");

    await this.callHook("$afterInit");
    this.loadMiddlewaresFor("$afterInit");
  }

  async listen() {
    await this.callHook("$beforeListen");
    this.loadMiddlewaresFor("$beforeListen");

    await this.listenServers();

    await this.callHook("$afterListen");
    this.loadMiddlewaresFor("$afterListen");

    await this.ready();
  }

  async stop() {
    await this.callHook("$onDestroy");
    return this.injector.destroy();
  }

  public async ready() {
    const {startedAt} = this;

    await this.callHook("$onReady");
    this.loadMiddlewaresFor("$onReady");
    await this.injector.emit("$onServerReady");

    this.log(`Started in ${new Date().getTime() - startedAt.getTime()} ms`);
  }

  async callHook(key: string, ...args: any[]) {
    await callHook(this.injector, this.rootModule, key, ...args);
  }

  /**
   * Load middlewares from configuration for the given hook
   * @param hook
   * @protected
   */
  protected loadMiddlewaresFor(hook: string): void {
    const {settings} = this;
    const {env, middlewares = []} = settings;
    const defaultHook = "$beforeRoutesInit";

    middlewares
      .map<PlatformMiddlewareLoadingOptions>((middleware) => {
        return isFunction(middleware)
          ? {
              env,
              hook: defaultHook,
              use: middleware
            }
          : {
              env,
              hook: defaultHook,
              ...middleware
            };
      })
      .filter((options) => {
        return options.use && options.env === env && options.hook === hook;
      })
      .forEach(({use}) => {
        this.app.use(use);
      });
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

  protected useRouter(): this {
    return this;
  }

  protected useContext(): this {
    return this;
  }

  protected async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    this.createInjector(module, {
      ...settings,
      PLATFORM_NAME: this.PLATFORM_NAME
    });
    this.createRootModule(module);

    await this.runLifecycle();

    return this;
  }

  protected async listenServers(): Promise<void> {
    await Promise.all([listenHttpServer(this.injector), listenHttpsServer(this.injector)]);
  }

  protected async logRoutes() {
    const {logger, platform} = this;

    if (!this.settings.logger.disableRoutesSummary && !this.disableBootstrapLog) {
      logger.info("Routes mounted :");
      logger.info(printRoutes(await this.injector.alterAsync("$logRoutes", platform.getRoutes())));
    }
  }

  protected async loadRoutes(routes: IRoute[]) {
    const {platform} = this;

    // istanbul ignore next
    if (this.settings.logger.level !== "off") {
      this.app.use(PlatformLogMiddleware);
    }

    if (this.settings.acceptMimes?.length) {
      this.app.use(GlobalAcceptMimesMiddleware);
    }

    this.log("Load routes");
    await this.callHook("$beforeRoutesInit");
    this.loadMiddlewaresFor("$beforeRoutesInit");

    platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");
    this.loadMiddlewaresFor("$onRoutesInit");

    await this.loadStatics();

    await this.callHook("$afterRoutesInit");
    this.loadMiddlewaresFor("$afterRoutesInit");
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
