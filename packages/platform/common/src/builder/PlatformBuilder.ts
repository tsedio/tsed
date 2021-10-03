import {classOf, constructorOf, nameOf, toMap, Type} from "@tsed/core";
import {Container, createContainer, getConfiguration, InjectorService, IProvider, setLoggerLevel} from "@tsed/di";
import {importProviders} from "@tsed/components-scan";
import {PerfLogger} from "@tsed/perf";
import {getMiddlewaresForHook} from "@tsed/platform-middlewares";
import {PlatformModule} from "../PlatformModule";
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

const SKIP_HOOKS = ["$beforeInit", "$afterInit", "$onInit", "$onMountingMiddlewares"];

/**
 * @ignore
 */
export interface PlatformType<T = any> extends Type<T> {
  providers: IProvider[];
}

const {bind, start, end, log} = PerfLogger.get("bootstrap");

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
  protected locals: Container;
  #rootModule: any;
  #injector: InjectorService;
  #providers: Map<Type, IProvider>;

  constructor({name, providers}: {name: string; providers: IProvider[]}) {
    this.name = name;
    this.#providers = toMap<any, IProvider>(providers, "provide");

    this.locals = new Container();

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
    return this.#rootModule;
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

  static build<T extends PlatformBuilder<any, any>>(platformBuildClass: PlatformType<T>): T {
    return new platformBuildClass({
      name: nameOf(platformBuildClass).replace("Platform", "").toLowerCase(),
      providers: platformBuildClass.providers
    });
  }

  log(...data: any[]) {
    return this.disableBootstrapLog && this.logger.info(...data);
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
  }

  async loadInjector() {
    const {injector} = this;
    await this.callHook("$beforeInit");

    this.log("Build providers");
    const container = createContainer(constructorOf(this.rootModule));

    await injector.load(container, PlatformModule);

    this.log("Settings and injector loaded");

    await this.callHook("$afterInit");
  }

  async listen() {
    await this.callHook("$beforeListen");

    await this.listenServers();

    await this.callHook("$afterListen");

    await this.ready();
    end();
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
    const {injector, rootModule} = this;
    log(hook);

    if (!this.disableBootstrapLog) {
      injector.logger.info(`\x1B[1mCall hook ${hook}\x1B[22m`);
    }

    // call hook for the Server
    if (hook in rootModule) {
      await rootModule[hook](...args);
    }

    // Load middlewares for the given hook
    this.loadMiddlewaresFor(hook);

    // call hooks added by providers
    if (!SKIP_HOOKS.includes(hook)) {
      await injector.emit(hook);
    }
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

  useProvider(token: Type<any>, settings?: Partial<IProvider>) {
    this.locals.addProvider(token, settings);

    return this;
  }

  protected async importProviders() {
    this.injector.logger.debug("Scan components");

    const providers = await importProviders(this.injector.settings, ["imports", "mount", "componentsScan"]);
    const routes = providers.filter((provider) => !!provider.route).map(({route, token}) => ({route, token}));

    this.settings.set("routes", routes);
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
    // istanbul ignore next
    if (settings.logger?.perf) {
      start();
      bind(this);
      settings.logger = {
        ...settings.logger,
        level: "off"
      };
    }

    this.createInjector(module, {
      ...settings,
      PLATFORM_NAME: this.name
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

    if (!this.settings.logger?.disableRoutesSummary && !this.disableBootstrapLog) {
      logger.info("Routes mounted :");
      logger.info(printRoutes(await this.injector.alterAsync("$logRoutes", platform.getRoutes())));
    }
  }

  protected async loadRoutes() {
    // istanbul ignore next
    if (this.settings.logger?.level !== "off") {
      const {PlatformLogMiddleware} = await import("@tsed/platform-log-middleware");
      this.app.use(PlatformLogMiddleware);
    }

    this.log("Load routes");
    await this.callHook("$beforeRoutesInit");

    await this.callHook("$$loadRoutes");

    await this.callHook("$onRoutesInit");

    await this.loadStatics();

    await this.callHook("$afterRoutesInit");
  }

  protected createInjector(module: Type<any>, settings: any) {
    const configuration = getConfiguration(module, settings);

    this.#injector = createInjector(configuration);

    // configure locals providers
    this.locals.forEach((provider) => {
      this.injector.addProvider(provider.token, provider);
    });

    createPlatformApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);
  }

  protected createRootModule(module: Type<any>) {
    this.#rootModule = this.injector.invoke(module);

    this.injector.delete(constructorOf(this.#rootModule));
    this.injector.delete(classOf(this.#rootModule));
  }
}
