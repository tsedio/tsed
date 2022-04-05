import {nameOf, Type} from "@tsed/core";
import {colors, createContainer, InjectorService, ProviderOpts, ProviderScope, setLoggerLevel} from "@tsed/di";
import {getMiddlewaresForHook} from "@tsed/platform-middlewares";
import {Platform} from "../services/Platform";
import {PlatformApplication} from "../services/PlatformApplication";
import {PlatformStaticsSettings} from "../config/interfaces/PlatformStaticsSettings";
import {getStaticsOptions} from "../utils/getStaticsOptions";
import {Route} from "../interfaces/Route";
import {getConfiguration} from "../utils/getConfiguration";
import type {IncomingMessage, Server, ServerResponse} from "http";
import {PlatformAdapter, PlatformBuilderSettings} from "../services/PlatformAdapter";
import {importProviders} from "../utils/importProviders";
import {createInjector} from "../utils/createInjector";
import {GlobalAcceptMimesMiddleware} from "../middlewares/GlobalAcceptMimesMiddleware";
import {printRoutes} from "../utils/printRoutes";
import {createHttpServer} from "../utils/createHttpServer";
import {createHttpsServer} from "../utils/createHttpsServer";
import type Https from "https";

/**
 * @platform
 */
export class PlatformBuilder<App = TsED.Application, Router = TsED.Router> {
  public static adapter: Type<PlatformAdapter<any, any>>;

  readonly name: string = "";
  protected startedAt = new Date();
  protected current = new Date();
  readonly #injector: InjectorService;
  readonly #rootModule: Type<any>;
  readonly #adapter: PlatformAdapter<App, Router>;
  #promise: Promise<this>;
  #servers: (() => Promise<Server | Https.Server>)[];
  #listeners: (Server | Https.Server)[] = [];

  protected constructor(adapter: Type<PlatformAdapter<App, Router>> | undefined, module: Type, settings: Partial<TsED.Configuration>) {
    this.#rootModule = module;
    const adapterKlass: Type<PlatformAdapter<App, Router>> = adapter || (PlatformBuilder.adapter as any);
    const name = nameOf(adapterKlass).replace("Platform", "").toLowerCase();

    const configuration = getConfiguration(settings, module);
    configuration.PLATFORM_NAME = name;
    this.name = name;

    this.#injector = createInjector({
      adapter: adapterKlass,
      settings: configuration
    });

    this.#adapter = this.#injector.get<PlatformAdapter<App, Router>>(PlatformAdapter)!;

    this.createHttpServers();

    this.#adapter.onInit && this.#adapter.onInit();

    this.log("Injector created...");
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

  static create<App = TsED.Application, Router = TsED.Router>(module: Type<any>, settings: PlatformBuilderSettings<App, Router>) {
    return this.build(module, {
      httpsPort: false,
      httpPort: false,
      ...settings,
      disableComponentsScan: true
    });
  }

  static build<App = TsED.Application, Router = TsED.Router>(
    module: Type<any>,
    {adapter, ...settings}: PlatformBuilderSettings<App, Router>
  ) {
    return new PlatformBuilder(adapter, module, settings);
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static async bootstrap<App = TsED.Application, Router = TsED.Router>(module: Type<any>, settings: PlatformBuilderSettings<App, Router>) {
    return this.build<App, Router>(module, settings).bootstrap();
  }

  callback(): (req: IncomingMessage, res: ServerResponse) => void;
  callback(req: IncomingMessage, res: ServerResponse): void;
  callback(req?: IncomingMessage, res?: ServerResponse) {
    if (req && res) {
      return this.app.callback()(req, res);
    }

    return this.app.callback();
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

    this.#adapter.useContext && this.#adapter.useContext();
    this.#adapter.useRouter && this.#adapter.useRouter();

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

  async listen(network = true) {
    if (!this.#promise) {
      await this.bootstrap();
    }

    await this.callHook("$beforeListen");

    if (network) {
      await this.listenServers();
    }

    await this.callHook("$afterListen");

    await this.ready();
  }

  async stop() {
    await this.callHook("$onDestroy");
    await this.injector.destroy();

    this.#listeners.map((server) => {
      return new Promise((resolve) => server.close(() => resolve(undefined)));
    });
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

  useProvider(token: Type<any>, settings?: Partial<ProviderOpts>) {
    this.injector.addProvider(token, settings);

    return this;
  }

  async bootstrap() {
    this.#promise = this.#promise || this.runLifecycle();

    return this.#promise;
  }

  protected async loadRoutes() {
    this.#adapter.beforeLoadRoutes && (await this.#adapter.beforeLoadRoutes());

    // istanbul ignore next
    if (this.settings.logger?.level !== "off") {
      const {PlatformLogMiddleware} = await import("@tsed/platform-log-middleware");
      this.app.use(PlatformLogMiddleware);
    }

    if (this.settings.acceptMimes?.length) {
      this.app.use(GlobalAcceptMimesMiddleware);
    }

    this.log("Load routes");

    if (this.rootModule.$beforeRoutesInit) {
      await this.rootModule.$beforeRoutesInit();
      this.rootModule.$beforeRoutesInit = () => {};
    }

    await this.loadStatics("$beforeRoutesInit");
    await this.callHook("$beforeRoutesInit");

    const routes = this.injector.settings.get<Route[]>("routes");

    this.platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");

    await this.loadStatics("$afterRoutesInit");

    await this.callHook("$afterRoutesInit");

    this.#adapter.afterLoadRoutes && (await this.#adapter.afterLoadRoutes());
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

  protected createHttpServers() {
    this.#servers = [createHttpServer(this.#injector, this.callback()), createHttpsServer(this.#injector, this.callback())].filter(
      Boolean
    ) as any[];
  }

  protected async listenServers(): Promise<void> {
    this.#listeners = await Promise.all(this.#servers.map((cb) => cb && cb()));
  }

  protected async logRoutes() {
    const {logger, platform} = this;

    this.log("Routes mounted...");

    if (!this.settings.logger?.disableRoutesSummary && !this.disableBootstrapLog) {
      logger.info(printRoutes(await this.injector.alterAsync("$logRoutes", platform.getRoutes())));
    }
  }
}
