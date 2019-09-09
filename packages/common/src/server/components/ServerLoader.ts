import {Deprecated, Type} from "@tsed/core";
import {IDIConfigurationOptions, InjectorService, IProvider} from "@tsed/di";
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {ServerSettingsService} from "../../config";
import {IRoute, RouteService} from "../../mvc";

import {GlobalErrorHandlerMiddleware} from "../components/GlobalErrorHandlerMiddleware";
import {LogIncomingRequestMiddleware} from "../components/LogIncomingRequestMiddleware";

import {ExpressApplication} from "../decorators/expressApplication";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";
import {IHTTPSServerOptions, IServerLifecycle} from "../interfaces";
import {ServeStaticService} from "../services/ServeStaticService";
import {callHook} from "../utils/callHook";
import {contextMiddleware} from "../utils/contextMiddleware";
import {createContainer} from "../utils/createContainer";
import {createExpressApplication} from "../utils/createExpressApplication";
import {createHttpServer} from "../utils/createHttpServer";
import {createHttpsServer} from "../utils/createHttpsServer";
import {createInjector} from "../utils/createInjector";
import {getConfiguration} from "../utils/getConfiguration";
import {listenServer} from "../utils/listenServer";
import {loadInjector} from "../utils/loadInjector";
import {printRoutes} from "../utils/printRoutes";
import {resolveProviders} from "../utils/resolveProviders";
import {setLoggerLevel} from "../utils/setLoggerLevel";

/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * [Lifecycle hooks](/docs/server-loader.md#lifecycle-hooks),
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 *
 * ```typescript
 * // In server.ts
 * import {ServerLoader, ServerSettings} from "@tsed/common";
 * import Path = require("path");
 * @ServerSettings({
 *    rootDir: Path.resolve(__dirname),
 *    port: 8000,
 *    httpsPort: 8080,
 *    mount: {
 *      "/rest": "${rootDir}/controllers/**\/*.js"
 *    }
 * })
 * export class Server extends ServerLoader {
 *
 *     $onReady(){
 *         console.log('Server started...');
 *     }
 *
 *     $onServerInitError(err){
 *         console.error(err);
 *     }
 * }
 *
 * // In app.ts
 * import Server from "./server";
 * new Server()
 *     .start()
 *     .then(() => console.log('started'))
 *     .catch(er => console.error(er));
 *
 * ```
 *
 */
export abstract class ServerLoader implements IServerLifecycle {
  public version: string = "0.0.0-PLACEHOLDER";
  readonly injector: InjectorService;
  private routes: IRoute[] = [];
  private startedAt = new Date();

  /**
   *
   */
  constructor(settings: Partial<IDIConfigurationOptions> = {}) {
    // create injector with initial configuration
    this.injector = createInjector(getConfiguration(this, settings));

    createExpressApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);
  }

  /**
   * Return the settings configured by the decorator @@ServerSettings@@.
   *
   * ```typescript
   * @ServerSettings({
   *    rootDir: Path.resolve(__dirname),
   *    port: 8000,
   *    httpsPort: 8080,
   *    mount: {
   *      "/rest": "${rootDir}/controllers/**\/*.js"
   *    }
   * })
   * export class Server extends ServerLoader {
   *     $onInit(){
   *         console.log(this.settings); // {rootDir, port, httpsPort,...}
   *     }
   * }
   * ```
   *
   * @returns {ServerSettingsService}
   */
  get settings(): IDIConfigurationOptions & ServerSettingsService {
    return this.injector.settings as IDIConfigurationOptions & ServerSettingsService;
  }

  /**
   * Return Express Application instance.
   * @returns {core.Express}
   */
  get expressApp(): Express.Application {
    return this.injector.get<ExpressApplication>(ExpressApplication)!;
  }

  /**
   * Return the InjectorService initialized by the server.
   * @returns {InjectorService}
   * @deprecated
   */
  get injectorService(): InjectorService {
    return this.injector;
  }

  /**
   * Return Http.Server instance.
   * @returns {Http.Server}
   */
  get httpServer(): Http.Server {
    return this.injector.get<HttpServer>(HttpServer)!;
  }

  /**
   * Return Https.Server instance.
   * @returns {Https.Server}
   */
  get httpsServer(): Https.Server {
    return this.injector.get<HttpsServer>(HttpsServer)!;
  }

  static async bootstrap(module: Type<ServerLoader>, settings: Partial<IDIConfigurationOptions> = {}): Promise<ServerLoader> {
    const server = new module(settings);

    await server.runLifecycle();

    return server;
  }

  /**
   * Create a new HTTP server with the provided `port`.
   * @returns {ServerLoader}
   * @deprecated
   */
  // istanbul ignore next
  public createHttpServer(port: string | number): ServerLoader {
    this.settings.httpPort = port;

    return this;
  }

  /**
   * Create a new HTTPs server.
   *
   * `options` {IHTTPSServerOptions}:
   *
   * - `port` &lt;number&gt;: Port number,
   * - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
   * - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
   * - `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
   * - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
   *
   * See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
   *
   * @param options Options to create new HTTPS server.
   * @returns {ServerLoader}
   * @deprecated
   */
  // istanbul ignore next
  public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {
    this.settings.httpsPort = options.port;

    return this;
  }

  /**
   * This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.
   *
   * ```typescript
   * @ServerSettings({
   *    rootDir,
   *    acceptMimes: ['application/json'] // optional
   * })
   * export class Server extends ServerLoader {
   *     $beforeRoutesInit(): void|Promise<any> {
   *         const methodOverride = require('method-override');
   *
   *         this.use(GlobalAcceptMimesMiddleware)
   *             .use(methodOverride());
   *
   *         // similar to
   *         this.expressApp.use(methodOverride());
   *
   *         // but not similar to
   *         this.expressApp.use(GlobalAcceptMimesMiddleware); // in this case, this middleware will not be added correctly to express.
   *
   *         return null;
   *     }
   * }
   * ```
   * @param args
   * @returns {ServerLoader}
   */
  public use(...args: any[]): ServerLoader {
    this.expressApp.use(...args);

    return this;
  }

  /**
   * Proxy to express set
   * @param setting
   * @param val
   * @returns {ServerLoader}
   */
  public set(setting: string, val: any): ServerLoader {
    this.expressApp.set(setting, val);

    return this;
  }

  /**
   * Proxy to express engine
   * @param ext
   * @param fn
   * @returns {ServerLoader}
   */
  public engine(ext: string, fn: (path: string, options: object, callback: (e: any, rendered: string) => void) => void): ServerLoader {
    this.expressApp.engine(ext, fn);

    return this;
  }

  /**
   * Start the express server.
   * @returns {Promise<any>|Promise}
   */
  public async start(): Promise<any> {
    try {
      await this.runLifecycle();
      await this.listen();
    } catch (err) {
      this.callHook("$onServerInitError", undefined, err);

      return Promise.reject(err);
    }
  }

  public async runLifecycle() {
    await this.loadSettingsAndInjector();
    await this.loadMiddlewares();
  }

  public async listen() {
    await this.callHook("$beforeListen");

    await this.startServers();

    await this.callHook("$afterListen");

    await this.ready();
    this.injector.logger.info(`Started in ${new Date().getTime() - this.startedAt.getTime()} ms`);
  }

  public async ready() {
    await this.callHook("$onReady");
    await this.injector.emit("$onServerReady");
  }

  /**
   * Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
   * pattern for more information.
   *
   * #### Example
   *
   * ```typescript
   * import {ServerLoader} from "@tsed/common";
   * import Path = require("path");
   *
   * export class Server extends ServerLoader {
   *
   *    constructor() {
   *        super();
   *
   *        let appPath = Path.resolve(__dirname);
   *
   *        this.scan(appPath + "/controllers/**\/**.js")
   *   }
   * }
   * ```
   *
   * Theses pattern scan all files in the directories controllers, services recursively.
   *
   * > On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
   *
   * ```typescript
   * const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
   * ```
   *
   * @param patterns
   * @param endpoint
   * @returns {ServerLoader}
   */
  public scan(patterns: string | string[], endpoint?: string): ServerLoader {
    if (endpoint) {
      this.addControllers(endpoint, [].concat(patterns as any));
    } else {
      this.addComponents([].concat(patterns as any));
    }

    return this;
  }

  /**
   * Add classes to the components list
   * @param classes
   * @param options
   */
  public addComponents(classes: any | any[], options: any = {}): ServerLoader {
    this.injector.settings.componentsScan = this.injector.settings.componentsScan.concat(classes);

    return this;
  }

  /**
   * Add classes decorated by @@Controller()@@ to components container.
   *
   * ### Example
   *
   * ```typescript
   * @Controller('/ctrl')
   * class MyController{
   * }
   *
   * new ServerLoader().addControllers('/rest', [MyController])
   * ```
   *
   * ::: tip
   * If the MyController class isn't decorated, the class will be ignored.
   * :::
   *
   * @param {string} endpoint
   * @param {any[]} controllers
   * @returns {ServerLoader}
   */
  public addControllers(endpoint: string, controllers: any | string | (any | string)[]) {
    this.settings.mount[endpoint] = (this.settings.mount[endpoint] || []).concat(controllers);
  }

  /**
   * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
   * under the endpoint.
   *
   * ::: tip
   * See [Versioning Rest API](/docs/controllers.md#routing) for more information.
   * :::
   *
   * @param endpoint
   * @param list
   * @returns {ServerLoader}
   * @deprecated use ServerLoader.addControllers instead
   */
  @Deprecated("Use ServerLoader.addControllers git instead")
  public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {
    this.addControllers(endpoint, list);

    return this;
  }

  public callHook(key: string, ...args: any[]) {
    return callHook(this.injector, this, key, ...args);
  }

  /**
   *
   * @returns {Promise<void>}
   */
  protected async loadSettingsAndInjector() {
    setLoggerLevel(this.injector);

    this.injector.logger.debug("Scan components");

    await this.resolveProviders();
    await this.callHook("$beforeInit");
    await this.callHook("$onInit");

    this.injector.logger.info("Build providers");

    await loadInjector(this.injector, createContainer(this));

    this.injector.logger.debug("Settings and injector loaded");
    await this.callHook("$afterInit");
  }

  /**
   * Initialize configuration of the express app.
   */
  protected async loadMiddlewares(): Promise<any> {
    this.injector.logger.debug("Mount middlewares");
    this.use(contextMiddleware(this.injector));
    this.use(LogIncomingRequestMiddleware); // FIXME will be deprecated

    await this.callHook("$onMountingMiddlewares");
    await this.callHook("$beforeRoutesInit"); // deprecated
    this.injector.logger.info("Load routes");

    const routeService = this.injector.get<RouteService>(RouteService)!;
    routeService.addRoutes(this.routes);

    await this.callHook("$onRoutesInit");

    const staticsService = this.injector.get<ServeStaticService>(ServeStaticService)!;
    staticsService.statics(this.injector.settings.statics);

    await this.callHook("$afterRoutesInit");

    // Import the globalErrorHandler
    this.use(GlobalErrorHandlerMiddleware);

    if (!this.settings.logger.disableRoutesSummary) {
      this.injector.logger.info("Routes mounted :");
      this.injector.logger.info(printRoutes(routeService.getRoutes()));
    }
  }

  protected async resolveProviders() {
    const providers: IProvider<any>[] = await resolveProviders(this.injector);

    this.routes = providers.filter(provider => !!provider.route).map(({route, token}) => ({route, token}));
  }

  /**
   * @deprecated
   */

  /**
   * Create a new server from settings parameters.
   * @param http
   * @param settings
   * @returns {Promise<TResult2|TResult1>}
   */
  protected async startServer(
    http: Http.Server | Https.Server,
    settings: {https: boolean; address: string | number; port: number}
  ): Promise<{address: string; port: number; https: boolean}> {
    this.injector.logger.debug(`Start server on ${settings.https ? "https" : "http"}://${settings.address}:${settings.port}`);
    const resolvedSettings = await listenServer(http, settings);
    this.injector.logger.info(`Listen server on ${settings.https ? "https" : "http"}://${settings.address}:${settings.port}`);

    return resolvedSettings;
  }

  /* istanbul ignore next */
  protected setSettings(settings: Partial<IDIConfigurationOptions>) {
    this.settings.set(settings);

    /* istanbul ignore next */
    if (this.settings.env === "test") {
      this.injector.logger.stop();
    }
  }

  /**
   * Initialize all servers.
   * @returns {Promise<any>}
   */
  private async startServers(): Promise<any> {
    const promises: Promise<any>[] = [];

    /* istanbul ignore else */
    if ((this.settings.httpPort as any) !== false) {
      const settings = this.settings.getHttpPort();
      promises.push(
        this.startServer(this.httpServer, {https: false, ...settings}).then(settings => {
          this.settings.setHttpPort(settings);
        })
      );
    }

    /* istanbul ignore else */
    if ((this.settings.httpsPort as any) !== false) {
      const settings = this.settings.getHttpsPort();
      promises.push(
        this.startServer(this.httpsServer, {https: true, ...settings}).then(settings => {
          this.settings.setHttpsPort(settings);
        })
      );
    }

    return Promise.all<any>(promises);
  }
}
