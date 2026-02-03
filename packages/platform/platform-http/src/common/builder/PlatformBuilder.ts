import type {IncomingMessage, ServerResponse} from "node:http";
import Http from "node:http";
import type Https from "node:https";

import type {Type} from "@tsed/core";
import {
  colors,
  configuration,
  constant,
  createContainer,
  destroyInjector,
  injector,
  InjectorService,
  logger,
  ProviderOpts,
  ProviderScope,
  TokenProvider
} from "@tsed/di";
import {$alter, $asyncAlter, $asyncEmit} from "@tsed/hooks";
import {PlatformLayer} from "@tsed/platform-router";
import Http2 from "http2";

import {defineConfiguration} from "../config/defineConfiguration.js";
import type {PlatformStaticsSettings} from "../config/PlatformStaticsSettings.js";
import {PlatformRouteDetails} from "../domain/PlatformRouteDetails.js";
import {application} from "../fn/application.js";
import {Route} from "../interfaces/Route.js";
import {Platform} from "../services/Platform.js";
import {PlatformAdapter, PlatformBuilderSettings} from "../services/PlatformAdapter.js";
import {PlatformApplication} from "../services/PlatformApplication.js";
import {closeServer} from "../utils/closeServer.js";
import {createInjector} from "../utils/createInjector.js";
import {CreateServerReturn} from "../utils/createServer.js";
import {getStaticsOptions} from "../utils/getStaticsOptions.js";
import {printRoutes} from "../utils/printRoutes.js";
import {resolveControllers} from "../utils/resolveControllers.js";

/**
 * @platform
 */
export class PlatformBuilder<App = TsED.Application> {
  protected startedAt = new Date();
  protected current = new Date();
  readonly #rootModule?: Type<any>;
  #promise: Promise<this>;
  #servers: CreateServerReturn[];
  #listeners: (Http.Server | Https.Server | Http2.Http2Server)[] = [];

  protected constructor(settings: Partial<TsED.Configuration>) {
    this.#rootModule = settings.rootModule;

    createInjector(defineConfiguration(settings));

    this.log(`Loading ${this.name.toUpperCase()} platform adapter...`);

    this.createHttpServers();

    this.log("Injector created...");
  }

  get name() {
    return this.adapter.NAME;
  }

  get rootModule(): any | undefined {
    return this.#rootModule && injector().get(this.#rootModule);
  }

  get app(): PlatformApplication<App> {
    return injector().get<PlatformApplication<App>>(PlatformApplication)!;
  }

  get platform() {
    return injector().get<Platform>(Platform)!;
  }

  get adapter() {
    return injector().get(PlatformAdapter);
  }

  /**
   * Return the settings configured by the decorator @@Configuration@@.
   *
   * ```typescript
   * @Configuration({
   *   port: 8000,
   *   httpsPort: 8080,
   *   mount: {
   *     "/rest": "${rootDir}/controllers/**\/*.js"
   *   }
   * })
   * export class Server {
   *   $onInit(){
   *     console.log(this.settings); // {rootDir, port, httpsPort,...}
   *   }
   * }
   * ```
   */
  get settings() {
    return configuration();
  }

  get logger() {
    return logger();
  }

  get disableBootstrapLog() {
    return constant<boolean>("logger.disableBootstrapLog");
  }

  /**
   * @deprecated use injector() instead of this method.
   */
  get injector(): InjectorService {
    return injector();
  }

  static create<App = TsED.Application>(settings: PlatformBuilderSettings<App>): PlatformBuilder<App>;
  static create<App = TsED.Application>(module: Type<any>, settings?: PlatformBuilderSettings<App>): PlatformBuilder<App>;
  static create<App = TsED.Application>(module: Type<any>, settings?: PlatformBuilderSettings<App>): PlatformBuilder<App> {
    return this.build(module as any, {
      httpsPort: false,
      httpPort: false,
      ...settings
    });
  }

  static build<App = TsED.Application>(settings: PlatformBuilderSettings<App>): PlatformBuilder<App>;
  static build<App = TsED.Application>(module: Type<any>, settings?: PlatformBuilderSettings<App>): PlatformBuilder<App>;
  static build<App = TsED.Application>(
    module: Type<any> | PlatformBuilderSettings<App>,
    settings?: PlatformBuilderSettings<App>
  ): PlatformBuilder<App> {
    return new PlatformBuilder({
      rootModule: settings ? module : undefined,
      ...(settings ? settings : (module as any))
    });
  }

  /**
   * Bootstrap a server application
   */
  static bootstrap<App = TsED.Application>(settings: PlatformBuilderSettings<App>): Promise<PlatformBuilder<App>>;
  static bootstrap<App = TsED.Application>(module: Type<any>, settings?: PlatformBuilderSettings<App>): Promise<PlatformBuilder<App>>;
  static bootstrap<App = TsED.Application>(
    module: Type<any> | PlatformBuilderSettings<App>,
    settings?: PlatformBuilderSettings<App>
  ): Promise<PlatformBuilder<App>> {
    return this.build<App>(module as any, settings).bootstrap();
  }

  callback(): (req: IncomingMessage, res: ServerResponse) => void;
  callback(req: IncomingMessage, res: ServerResponse): void;
  callback(...args: [IncomingMessage?, ServerResponse?]) {
    return (this.adapter.app.callback as any)(...args);
  }

  log(...data: any[]) {
    return !this.disableBootstrapLog && logger().info(...data, this.diff());
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
    [].concat(controllers as never[]).forEach((token: TokenProvider) => {
      configuration().get("routes").push({token, route: endpoint});
    });
  }

  public async runLifecycle() {
    // init adapter (Express, Koa, etc...)
    await this.adapter.onInit();

    await this.loadInjector();

    // add the context middleware to the application
    this.log("Mount app context");
    await this.adapter.useContext();

    // init routes (controllers, middlewares, etc...)
    this.log("Load routes");
    await this.adapter.beforeLoadRoutes();

    if (this.rootModule?.$beforeRoutesInit) {
      await this.rootModule.$beforeRoutesInit();
      // remove this method to avoid multiple call and preserve hook order
      this.rootModule.$beforeRoutesInit = () => {};
    }

    // Hooks execution (adding middlewares, controllers, services, etc...)
    await this.loadStatics("$beforeRoutesInit");
    await this.callHook("$beforeRoutesInit");

    const routes = configuration().get<Route[]>("routes");

    this.platform.addRoutes(routes);

    await this.callHook("$onRoutesInit");

    await this.loadStatics("$afterRoutesInit");
    await this.callHook("$afterRoutesInit");

    await this.adapter.afterLoadRoutes();

    // map routers are loaded after all hooks because it contains all added middlewares/controllers in the virtual Ts.ED layers
    // This step will convert all Ts.ED layers to the platform layer (Express or Koa)
    await this.mapRouters();

    // Server is bootstrapped and ready to listen

    return this;
  }

  async loadInjector() {
    this.log("Build providers");
    const settings = configuration();

    const routes = settings.get("routes").concat(resolveControllers(settings));

    settings.set("routes", routes);

    const container = createContainer();

    if (this.#rootModule) {
      container.delete(this.#rootModule);
      container.addProvider(this.#rootModule, {
        type: "server:module",
        scope: ProviderScope.SINGLETON
      });
    }

    await injector().load(container);

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
    await destroyInjector();

    this.#listeners.map(closeServer);
  }

  public async ready() {
    const {startedAt} = this;

    await this.callHook("$onReady");

    this.log(`Started in ${new Date().getTime() - startedAt.getTime()} ms`);
  }

  async callHook(hook: string, ...args: any[]) {
    if (!this.disableBootstrapLog) {
      logger().debug(`\x1B[1mCall hook ${hook}\x1B[22m`);
    }

    // Load middlewares for the given hook
    this.loadMiddlewaresFor(hook);

    // call hooks added by providers
    await $asyncEmit(hook, args);
  }

  loadStatics(hook: string) {
    const statics = constant<PlatformStaticsSettings>("statics");
    const app = application();

    getStaticsOptions(statics).forEach(({path, options}) => {
      if (options.hook === hook) {
        app.statics(path, options);
      }
    });
  }

  useProvider(token: Type<any>, settings?: Partial<ProviderOpts>) {
    injector().addProvider(token, settings);

    return this;
  }

  bootstrap(): Promise<this> {
    this.#promise = this.#promise || this.runLifecycle();

    return this.#promise;
  }

  protected async mapRouters() {
    const layers = this.platform.getLayers();

    await this.adapter.mapLayers(layers);

    const rawBody =
      constant("rawBody") ||
      layers.some(({handlers}) => {
        return handlers.some((handler) => handler.opts?.paramsTypes?.RAW_BODY);
      });

    this.settings.set("rawBody", rawBody);

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
    const middlewares = $alter("$alterMiddlewaresForHook", constant<{use: any}[]>("middlewares", []), [hook]);

    return middlewares.forEach(({use}) => {
      this.app.use(use);
    });
  }

  protected createHttpServers() {
    this.#servers = this.adapter.getServers();
  }

  protected async listenServers(): Promise<void> {
    this.#listeners = await Promise.all(this.#servers.map((cb) => cb && cb()));
  }

  protected async logRoutes(layers: PlatformLayer[]) {
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

      logger().info(printRoutes(await $asyncAlter("$logRoutes", routes)));
    }
  }
}
