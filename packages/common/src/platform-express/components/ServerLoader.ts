import {constructorOf, Deprecated, Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {IRoute} from "../../platform";
import {
  createHttpServer,
  createHttpsServer,
  HttpServer,
  HttpsServer,
  importProviders,
  PlatformBuilder,
  setLoggerLevel
} from "../../platform-builder";
import {ExpressApplication} from "../decorators/expressApplication";
import {IHTTPSServerOptions, IServerLifecycle} from "../interfaces";
import {GlobalErrorHandlerMiddleware} from "../middlewares/GlobalErrorHandlerMiddleware";
import {LogIncomingRequestMiddleware} from "../middlewares/LogIncomingRequestMiddleware";

import "../services/PlatformExpressApplication";
import "../services/PlatformExpressRouter";
import {ServeStaticService} from "../services/ServeStaticService";
import {createExpressApplication} from "../utils";

const VERSION = require("../../../package.json").version;

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
 * export class Server {
 *   $beforeRoutesInit(){
 *     // add middlewares here
 *   }
 * }
 *
 * // In index.ts
 * import Server from "./server";
 *
 * function bootstrap(settings: any) {
 *   const server = ServerLoader.bootstrap(settings);
 *
 *   await server.listen()
 * }
 *
 * bootstrap();
 * ```
 */
export abstract class ServerLoader extends PlatformBuilder implements IServerLifecycle {
  public version: string = VERSION;

  constructor(settings: Partial<TsED.Configuration> = {}) {
    super();
    this._rootModule = this;
    this.createInjector(constructorOf(this), settings);
  }

  /**
   * Return Express Application instance.
   * @returns {core.Express}
   * @deprecated Use this.app.raw
   */
  get expressApp(): Express.Application {
    return this.injector.get<ExpressApplication>(ExpressApplication)!;
  }

  /**
   * Return the InjectorService initialized by the server.
   * @returns {InjectorService}
   * @deprecated use this.injector
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

  static async bootstrap(module: Type<ServerLoader>, settings: Partial<TsED.Configuration> = {}): Promise<ServerLoader> {
    const server = new module(settings);

    await server.runLifecycle();

    return server;
  }

  /**
   * Create a new HTTP server with the provided `port`.
   * @returns {ServerLoader}
   * @deprecated Use this.settings.httpPort instead
   */
  // istanbul ignore next
  public createHttpServer(port: string | number): ServerLoader {
    this.settings.httpPort = port;

    return this;
  }

  /**
   * Create a new HTTPs server.
   *
   * `options` @@IHTTPSServerOptions@@:
   *
   * key | type | Description
   * ---|---|---
   * port | number | Port number
   * key | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer), Object | The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
   * passphrase | string | A string containing the passphrase for the private key or pfx.
   * cert | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) | A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
   * ca | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) | A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
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
   *         this.app
   *             .use(GlobalAcceptMimesMiddleware)
   *             .use(methodOverride());
   *
   *         return null;
   *     }
   * }
   * ```
   * @param args
   * @returns {ServerLoader}
   */
  public use(...args: any[]): ServerLoader {
    this.app.use(...args);

    return this;
  }

  /**
   * Proxy to express set
   * @param setting
   * @param val
   * @returns {ServerLoader}
   * @deprecated Use this.app.raw.set() instead of
   */
  public set(setting: string, val: any): ServerLoader {
    this.app.raw.set(setting, val);

    return this;
  }

  /**
   * Proxy to express engine
   * @param ext
   * @param fn
   * @returns {ServerLoader}
   * @deprecated Use this.app.raw.engine() instead of
   */
  public engine(ext: string, fn: (path: string, options: object, callback: (e: any, rendered: string) => void) => void): ServerLoader {
    this.app.raw.engine(ext, fn);

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

  /**
   * Run server lifecycle
   */
  public async runLifecycle() {
    const routes = await this.loadSettingsAndInjector();

    await this.loadMiddlewares(routes);
  }

  /**
   * Run listen event and start servers
   */
  public async listen() {
    await this.callHook("$beforeListen");

    await this.listenServers();

    await this.callHook("$afterListen");

    await this.ready();
    this.injector.logger.info(`Started in ${new Date().getTime() - this.startedAt.getTime()} ms`);
  }

  /**
   * Run ready event
   */
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
   * @deprecated Will be removed in future
   */
  @Deprecated("Use ServerLoader.addControllers or ServerLoader.addComponents instead")
  public scan(patterns: string | string[], endpoint?: string): ServerLoader {
    if (endpoint) {
      this.addControllers(endpoint, [].concat(patterns as any));
    } else {
      this.addComponents([].concat(patterns as any));
    }

    return this;
  }

  addComponents(classes: any | any[], options: any = {}) {
    return super.addComponents(classes);
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
  @Deprecated("Use ServerLoader.addControllers instead")
  public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {
    this.addControllers(endpoint, list);

    return this;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  protected async loadSettingsAndInjector(): Promise<IRoute[]> {
    setLoggerLevel(this.injector);

    const routes = await importProviders(this.injector);

    await this.loadInjector();

    return routes;
  }

  /**
   * Initialize configuration of the express app.
   */
  protected async loadMiddlewares(routes: IRoute[]): Promise<any> {
    await this.createContext();
    await this.loadRoutes(routes);
    await this.logRoutes();
  }

  /**
   * Load given routes and add GlobalErrorHandlerMiddleware
   * @param routes
   */
  protected async loadRoutes(routes: IRoute[]) {
    this.settings.logger.level !== "off" && this.app.use(LogIncomingRequestMiddleware); // FIXME will be deprecated

    await this.callHook("$onMountingMiddlewares"); // deprecated

    await super.loadRoutes(routes);

    // Import the globalErrorHandler
    this.use(GlobalErrorHandlerMiddleware);
  }

  protected async loadStatics() {
    const staticsService = this.injector.get<ServeStaticService>(ServeStaticService)!;
    staticsService.statics(this.injector.settings.statics);
  }

  /* istanbul ignore next */
  protected setSettings(settings: Partial<TsED.Configuration>) {
    this.settings.set(settings);

    /* istanbul ignore next */
    if (this.settings.env === "test") {
      this.injector.logger.stop();
    }
  }

  /**
   * Create Server.injector with express application, Http and Https server
   * @param module
   * @param settings
   */
  protected createInjector(module: Type<any> | any, settings: any) {
    super.createInjector(module, settings);
    createExpressApplication(this.injector);
    createHttpsServer(this.injector);
    createHttpServer(this.injector);

    this.settings.imports?.forEach(token => {
      this.injector.invoke(token);
    });
  }
}
