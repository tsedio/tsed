import {nameOf, Type} from "@tsed/core";
import {colors, InjectorService, ProviderOpts, runInContext, setLoggerConfiguration, TokenProvider} from "@tsed/di";
import {getMiddlewaresForHook} from "@tsed/platform-middlewares";
import {PlatformLayer} from "@tsed/platform-router";
import type {IncomingMessage, Server, ServerResponse} from "http";
import type Https from "https";
import {PlatformStaticsSettings} from "../config/interfaces/PlatformStaticsSettings";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails";
import {Route} from "../interfaces/Route";
import {Platform} from "../services/Platform";
import {PlatformAdapter, PlatformBuilderSettings} from "../services/PlatformAdapter";
import {PlatformApplication} from "../services/PlatformApplication";
import {createHttpServer} from "../utils/createHttpServer";
import {createHttpsServer} from "../utils/createHttpsServer";
import {createInjector} from "../utils/createInjector";
import {getConfiguration} from "../utils/getConfiguration";
import {getStaticsOptions} from "../utils/getStaticsOptions";
import {printRoutes} from "../utils/printRoutes";

/**
 * @platform
 */
export class PlatformBuilder<App = TsED.Application> {
  public static adapter: Type<PlatformAdapter<any>>;

  readonly name: string = "";
  protected startedAt = new Date();
  protected current = new Date();
  readonly #injector: InjectorService;
  readonly #rootModule: Type<any>;
  readonly #adapter: PlatformAdapter<App>;
  #promise: Promise<this>;
  #servers: (() => Promise<Server | Https.Server>)[];
  #listeners: (Server | Https.Server)[] = [];

  protected constructor(adapter: Type<PlatformAdapter<App>> | undefined, module: Type, settings: Partial<TsED.Configuration>) {
    this.#rootModule = module;

    const configuration = getConfiguration(settings, module);
    const adapterKlass: Type<PlatformAdapter<App>> = adapter || (PlatformBuilder.adapter as any);
    const name = nameOf(adapterKlass).replace("Platform", "").toLowerCase();

    configuration.PLATFORM_NAME = name;
    this.name = name;

    this.#injector = createInjector({
      adapter: adapterKlass,
      settings: configuration
    });

    this.#adapter = this.#injector.get<PlatformAdapter<App>>(PlatformAdapter)!;

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

  get app(): PlatformApplication<App> {
    return this.injector.get<PlatformApplication<App>>(PlatformApplication)!;
  }

  get platform() {
    return this.injector.get<Platform>(Platform)!;
  }

  get adapter() {
    return this.#adapter;
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
    return this.settings.get("logger.disableBootstrapLog");
  }

  static create<App = TsED.Application>(module: Type<any>, settings: PlatformBuilderSettings<App>) {
    return this.build(module, {
      httpsPort: false,
      httpPort: false,
      ...settings
    });
  }

  static build<App = TsED.Application>(module: Type<any>, {adapter, ...settings}: PlatformBuilderSettings<App>) {
    return new PlatformBuilder(adapter, module, settings);
  }

  /**
   * Bootstrap a server application
   * @param module
   * @param settings
   */
  static async bootstrap<App = TsED.Application>(module: Type<any>, settings: PlatformBuilderSettings<App>) {
    return this.build<App>(module, settings).bootstrap();
  }

  callback(): (req: IncomingMessage, res: ServerResponse) => void;
  callback(req: IncomingMessage, res: ServerResponse): void;
  callback(req?: IncomingMessage, res?: ServerResponse) {
    if (req && res) {
      return this.callback()(req, res);
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
  public addComponents(classes: Type | Type[]) {
    this.settings.set("imports", this.settings.get<any[]>("imports", []).concat(classes));

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
  public addControllers(endpoint: string, controllers: TokenProvider | TokenProvider[]) {
    [].concat(controllers).forEach((token) => {
      this.settings.routes.push({token, route: endpoint});
    });
  }

  public async runLifecycle() {
    setLoggerConfiguration(this.injector);

    await this.loadInjector();

    this.#adapter.useContext();

    await this.loadRoutes();

    return this;
  }

  async loadInjector() {
    const {injector} = this;
    this.log("Build providers");

    await injector.loadModule(this.#rootModule);

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
    if (this.settings.get("logger.level") !== "off") {
      const {PlatformLogMiddleware} = await import("@tsed/platform-log-middleware");
      this.app.use(PlatformLogMiddleware);
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

    await this.mapRouters();
  }

  protected async mapRouters() {
    const layers = this.platform.getLayers();

    this.#adapter.mapLayers(layers);

    return this.logRoutes(layers.filter((layer) => layer.isProvider()));
  }

  protected diff() {
    const ms = colors.yellow(`+${new Date().getTime() - this.current.getTime()}ms`);
    this.current = new Date();
    return ms;
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

  protected async logRoutes(layers: PlatformLayer[]) {
    const {logger} = this;

    this.log("Routes mounted...");

    if (!this.settings.get("logger.disableRoutesSummary") && !this.disableBootstrapLog) {
      const routes: PlatformRouteDetails[] = layers.map((layer) => {
        return {
          url: layer.path,
          method: layer.method,
          name: layer.opts.name || `${layer.provider.className}.constructor()`,
          className: layer.opts.className || layer.provider.className,
          methodClassName: layer.opts.methodClassName || ""
        } as PlatformRouteDetails;
      });

      logger.info(printRoutes(await this.injector.alterAsync("$logRoutes", routes)));
    }
  }
}
