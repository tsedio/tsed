import {classOf, constructorOf, Type} from "@tsed/core";
import {IDIConfigurationOptions, InjectorService} from "@tsed/di";
import {IRoute, Platform, PlatformApplication} from "../../platform";
import {ContextMiddleware} from "../middlewares/ContextMiddleware";
import {
  callHook,
  createContainer,
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

export abstract class PlatformBuilder {
  protected startedAt = new Date();
  protected _rootModule: any;
  protected _injector: InjectorService;

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
   * @returns {ServerSettingsService}
   */
  get settings() {
    return this.injector.settings;
  }

  get logger() {
    return this.injector.logger;
  }

  static build<T extends PlatformBuilder>(platformBuildClass: Type<T>): T {
    return new platformBuildClass();
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
    await this.createContext();
    await this.loadRoutes(routes);
    await this.logRoutes();
  }

  async loadInjector() {
    const {injector, logger} = this;
    await this.callHook("$beforeInit");
    await this.callHook("$onInit");

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

  protected async bootstrap(module: Type<any>, settings: Partial<TsED.Configuration> = {}) {
    this.createInjector(module, settings);
    this.createRootModule(module);

    await this.runLifecycle();

    return this;
  }

  protected abstract async loadStatics(): Promise<void>;

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

  protected async createContext() {
    const middleware = new ContextMiddleware(this.injector);

    return this.app.use(middleware.use.bind(middleware));
  }

  protected async loadRoutes(routes: IRoute[]) {
    const {logger, platform} = this;

    logger.info("Load routes");
    await this.callHook("$beforeRoutesInit"); // deprecated

    platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");

    await this.loadStatics();

    await this.callHook("$afterRoutesInit");
  }

  protected createInjector(module: Type<any>, settings: any) {
    this._injector = createInjector(getConfiguration(module, settings));
    createPlatformApplication(this.injector);
  }

  protected createRootModule(module: Type<any>) {
    this._rootModule = this.injector.invoke(module, undefined, {
      imports: this.settings.imports
    });

    this.injector.delete(constructorOf(this._rootModule));
    this.injector.delete(classOf(this._rootModule));
  }
}
