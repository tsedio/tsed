import {nameOf, toMap, Type} from "@tsed/core";
import {colors, Container, createContainer, InjectorService, IProvider, ProviderScope, setLoggerLevel} from "@tsed/di";
import {importProviders} from "@tsed/components-scan";
import {getMiddlewaresForHook} from "@tsed/platform-middlewares";
import {GlobalAcceptMimesMiddleware} from "../middlewares";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformHandler} from "../services/PlatformHandler";
import {PlatformRequest} from "../services/PlatformRequest";
import {PlatformResponse} from "../services/PlatformResponse";
import {PlatformRouter} from "../services/PlatformRouter";
import {
  createHttpServer,
  createHttpsServer,
  createInjector,
  createPlatformApplication,
  listenHttpServer,
  listenHttpsServer,
  printRoutes
} from "../utils";
import {PlatformStaticsSettings} from "../config/interfaces/PlatformStaticsSettings";
import {getStaticsOptions} from "../utils/getStaticsOptions";
import {Route} from "../interfaces/Route";
import {getConfiguration} from "../utils/getConfiguration";

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
  static currentPlatform: Type<PlatformBuilder<any, any>> & PlatformBootstrap;
  readonly name: string = "";
  protected startedAt = new Date();
  protected current = new Date();
  protected locals: Container;

  #injector: InjectorService;
  #providers: Map<Type, IProvider>;
  #rootModule: Type<any>;

  constructor({name, providers, settings, module}: {name: string; providers: IProvider[]; settings: any; module: Type<any>}) {
    this.name = name;
    this.#providers = toMap<any, IProvider>(providers, "provide");

    this.locals = new Container();

    this.#rootModule = module;
    const configuration = getConfiguration(settings, module);

    this.useProvider(PlatformHandler, this.#providers.get(PlatformHandler))
      .useProvider(PlatformResponse, this.#providers.get(PlatformResponse))
      .useProvider(PlatformRequest, this.#providers.get(PlatformRequest))
      .useProvider(PlatformRouter, this.#providers.get(PlatformRouter))
      .useProvider(PlatformApplication, this.#providers.get(PlatformApplication))
      .useProvider(Platform, this.#providers.get(Platform));
  }

  get injector(): InjectorService {
    return this.#injector;
  }

  get rootModule(): any {
    return this.#injector.get(this.#rootModule);
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
    return this.settings.logger?.disableBootstrapLog;
  }

  static build<T extends PlatformBuilder<any, any>>(
    platformBuildClass: PlatformType<T>,
    module: Type<any>,
    settings: Partial<TsED.Configuration> = {}
  ): T {
    return new platformBuildClass({
      name: nameOf(platformBuildClass).replace("Platform", "").toLowerCase(),
      module,
      settings,
      providers: platformBuildClass.providers
    });
  }

  log(...data: any[]) {
    return !this.disableBootstrapLog && this.logger.info(...data, this.diff());
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

    await this.importProviders();
    await this.loadInjector();

    this.useContext();
    this.useRouter();

    await this.loadRoutes();
    await this.logRoutes();

    return this;
  }

  async loadInjector() {
    const {injector} = this;
    this.log("Build providers");

    const container = createContainer();

    container.addProvider(this.#rootModule, {
      type: "server:module",
      scope: ProviderScope.SINGLETON
    });

    await injector.load(container);

    this.log("Settings and injector loaded...");

    await this.callHook("$afterInit");
  }

  async listen() {
    await this.callHook("$beforeListen");

    await this.listenServers();

    await this.callHook("$afterListen");

    await this.ready();
  }

  async stop() {
    await this.callHook("$onDestroy");
    return this.injector.destroy();
  }

  public async ready() {
    const {startedAt} = this;

    await this.callHook("$onReady");
    await this.injector.emit("$onServerReady");

    this.log(`Started in ${new Date().getTime() - startedAt.getTime()} ms`);
  }

  async callHook(hook: string, ...args: any[]) {
    const {injector} = this;

    if (!this.disableBootstrapLog) {
      injector.logger.debug(`\x1B[1mCall hook ${hook}\x1B[22m`);
    }

    // Load middlewares for the given hook
    this.loadMiddlewaresFor(hook);

    // call hooks added by providers
    await injector.emit(hook, ...args);
  }

  async loadStatics(hook: string): Promise<void> {
    const statics = this.settings.get<PlatformStaticsSettings>("statics");

    getStaticsOptions(statics).forEach(({path, options}) => {
      if (options.hook === hook) {
        this.platform.app.statics(path, options);
      }
    });
  }

  useProvider(token: Type<any>, settings?: Partial<IProvider>) {
    this.locals.addProvider(token, settings);

    return this;
  }

  protected diff() {
    const ms = colors.yellow(`+${new Date().getTime() - this.current.getTime()}ms`);
    this.current = new Date();
    return ms;
  }

  protected async importProviders() {
    this.injector.logger.debug("Scan components");

    const providers = await importProviders(this.injector.settings, ["imports", "mount", "componentsScan"]);
    const routes = providers.filter((provider) => !!provider.route).map(({route, token}) => ({route, token}));

    this.settings.set("routes", routes);
    this.log("Providers loaded...");
  }

  /**
   * Load middlewares from configuration for the given hook
   * @param hook
   * @protected
   */
  protected loadMiddlewaresFor(hook: string): void {
    return getMiddlewaresForHook(hook, this.settings, "$beforeRoutesInit").forEach(({use}) => {
      this.app.use(use);
    });
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
      PLATFORM_NAME: this.name
    });

    await this.runLifecycle();

    return this;
  }

  protected async listenServers(): Promise<void> {
    await Promise.all([listenHttpServer(this.injector), listenHttpsServer(this.injector)]);
  }

  protected async logRoutes() {
    const {logger, platform} = this;

    this.log("Routes mounted...");

    if (!this.settings.logger?.disableRoutesSummary && !this.disableBootstrapLog) {
      logger.info(printRoutes(await this.injector.alterAsync("$logRoutes", platform.getRoutes())));
    }
  }

  protected async loadRoutes() {
    // istanbul ignore next
    if (this.settings.logger?.level !== "off") {
      const {PlatformLogMiddleware} = await import("@tsed/platform-log-middleware");
      this.app.use(PlatformLogMiddleware);
    }

    if (this.settings.acceptMimes?.length) {
      this.app.use(GlobalAcceptMimesMiddleware);
    }

    this.log("Load routes");

    await this.loadStatics("$beforeRoutesInit");
    await this.callHook("$beforeRoutesInit");

    const routes = this.injector.settings.get<Route[]>("routes");

    this.platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");

    await this.loadStatics("$afterRoutesInit");

    await this.callHook("$afterRoutesInit");
  }

  protected createInjector(module: Type<any>, settings: any) {
    // configure locals providers
    this.#rootModule = module;
    const configuration = getConfiguration(settings, module);

    this.#injector = createInjector(configuration);

    this.locals.forEach((provider) => {
      this.injector.addProvider(provider.token, provider);
    });

    createPlatformApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);

    this.log("Injector created...");
  }
}
