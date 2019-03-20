import {InjectorService} from "@tsed/di";
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {importComponents} from "../utils/importComponents";
import {IServerSettings} from "../../config/interfaces/IServerSettings";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {ExpressApplication} from "../../mvc/decorators/class/expressApplication";

import {GlobalErrorHandlerMiddleware} from "../components/GlobalErrorHandlerMiddleware";
import {LogIncomingRequestMiddleware} from "../components/LogIncomingRequestMiddleware";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";
import {IServerLifecycle} from "../interfaces";
import {createExpressApplication} from "../utils/createExpressApplication";
import {createHttpServer} from "../utils/createHttpServer";
import {createHttpsServer} from "../utils/createHttpsServer";
import {createInjector} from "../utils/createInjector";
import {contextMiddleware} from "../utils/contextMiddleware";

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
  private _injector: InjectorService;

  /**
   *
   */
  constructor() {}

  /**
   * Return the injectorService initialized by the server.
   * @returns {InjectorService}
   */
  get injector(): InjectorService {
    return this._injector;
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
  get settings(): ServerSettingsService {
    return this.injector.settings as ServerSettingsService;
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
    return this._injector;
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

  /**
   * Init injector with minimal configuration
   * @deprecated
   */
  async init() {
    if (!this._injector) {
      const settings = ServerSettingsService.getMetadata(this);

      this._injector = await createInjector(settings);

      if (settings) {
        this.setSettings(settings);
      }

      await createExpressApplication(this.injector);
      await createHttpsServer(this.injector);
      await createHttpServer(this.injector);
    }
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
   *     $onMountingMiddlewares(): void|Promise<any> {
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
  public engine(ext: string, fn: Function): ServerLoader {
    this.expressApp.engine(ext, fn);

    return this;
  }

  /**
   * Start the express server.
   * @returns {Promise<any>|Promise}
   */
  public async start(): Promise<any> {
    try {
      const start = new Date();
      await this.init();
      await this.loadSettingsAndInjector();
      await this.loadMiddlewares();
      await this.startServers();

      await this.callHook("$onReady");
      await this.injector.emit("$onServerReady");

      this.injector.logger.info(`Started in ${new Date().getTime() - start.getTime()} ms`);
    } catch (err) {
      this.callHook("$onServerInitError", undefined, err);

      return Promise.reject(err);
    }
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
   * !> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
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
    this.settings.componentsScan = this.settings.componentsScan.concat(classes);

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
  public addControllers(endpoint: string, controllers: any[]) {
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
   */
  public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {
    this.addControllers(endpoint, list);

    return this;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  protected async loadSettingsAndInjector() {
    const level = this.settings.logger.level;

    /* istanbul ignore next */
    if (level && this.settings.env !== "test") {
      this.injector.logger.level = level;
    }

    await this.resolve();
    await this.callHook("$onInit");

    this.injector.logger.debug("Initialize settings");

    this.settings.forEach((value, key) => {
      this.injector.logger.info(`settings.${key} =>`, value);
    });

    this.injector.logger.info("Build services");

    await this.injector.load();
    this.injector.logger.debug("Settings and injector loaded");
  }

  /**
   * Create a new server from settings parameters.
   * @param http
   * @param settings
   * @returns {Promise<TResult2|TResult1>}
   */
  protected startServer(
    http: Http.Server | Https.Server,
    settings: {https: boolean; address: string | number; port: number}
  ): Promise<{address: string; port: number}> {
    const {address, port, https} = settings;

    this.injector.logger.debug(`Start server on ${https ? "https" : "http"}://${settings.address}:${settings.port}`);
    const promise = new Promise((resolve, reject) => {
      http.on("listening", resolve).on("error", reject);
    }).then(() => {
      const port = (http.address() as any).port;
      this.injector.logger.info(`HTTP Server listen on ${https ? "https" : "http"}://${settings.address}:${port}`);

      return {address: settings.address as string, port};
    });

    http.listen(port, address as any);

    return promise;
  }

  /**
   * Initialize configuration of the express app.
   */
  protected async loadMiddlewares(): Promise<any> {
    this.injector.logger.debug("Mount middlewares");
    this.use(contextMiddleware(this.injector));
    this.use(LogIncomingRequestMiddleware);
    await this.callHook("$onMountingMiddlewares", undefined, this.expressApp);
    await this.injector.emit("$beforeRoutesInit");
    await this.injector.emit("$onRoutesInit");
    await this.injector.emit("$afterRoutesInit");

    await this.callHook("$afterRoutesInit", undefined, this.expressApp);

    // Import the globalErrorHandler
    this.use(GlobalErrorHandlerMiddleware);
  }

  protected async resolve() {
    const components = await Promise.all([
      importComponents(this.settings.mount, this.settings.exclude),
      importComponents(this.settings.componentsScan, this.settings.exclude)
    ]);

    const routes = components.reduce((flat, value) => flat.concat(value), []).filter(component => !!component.endpoint);

    this.settings.set("routes", routes);
    // this.settings.addComponents();
  }

  /**
   *
   */
  protected setSettings(settings: IServerSettings) {
    this.settings.set(settings);

    /* istanbul ignore next */
    if (this.settings.env === "test") {
      this.injector.logger.stop();
    }
  }

  private callHook = (key: string, elseFn = new Function(), ...args: any[]) => {
    const self: any = this;

    if (key in this) {
      this.injector.logger.debug(`\x1B[1mCall hook ${key}\x1B[22m`);

      return self[key](...args);
    }

    return elseFn();
  };

  /**
   * Initiliaze all servers.
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
