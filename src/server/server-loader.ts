import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {NotAcceptable} from "ts-httpexceptions";
import Metadata from "../services/metadata";
import {CONTROLLER_URL, CONTROLLER_MOUNT_ENDPOINTS, SERVER_SETTINGS} from "../constants/metadata-keys";
import {ExpressApplication, ControllerService, InjectorService} from "../services";
import MiddlewareService from "../services/middleware";
import {Deprecated} from "../decorators/method/deprecated";
import {
    ServerSettingsService, ServerSettingsProvider, IServerMountDirectories, IServerSettings
} from "../services/server-settings";
import GlobalErrorHandlerMiddleware from "../middlewares/global-error-handler";

export interface IHTTPSServerOptions extends Https.ServerOptions {
    port: string | number;
}
/**
 * ServerLoader lifecycle let you intercept a phase.
 */
export interface IServerLifecycle {
    /**
     * This method is called when the server starting his lifecycle.
     */
    $onInit?(): void | Promise<any>;

    $onMountingMiddlewares?: Function;
    $afterRoutesInit?: Function;
    $onReady?: Function;

    $onServerInitError?(error): any;
    $onError?(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void;
    $onAuth?(request: Express.Request, response: Express.Response, next?: Express.NextFunction, authorization?: any): boolean | void;
}

/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 * * Error management (GlobalErrorHandler),
 * * Authentication strategy.
 *
 */
export abstract class ServerLoader implements IServerLifecycle {

    /**
     * Application express.
     * @type {core.Express}
     */
    private _expressApp: Express.Application = Express();
    /**
     *
     */
    private _settings: ServerSettingsProvider;
    /**
     * Instance of httpServer.
     */
    private _httpServer: Http.Server;
    /**
     * Instance of HttpsServer.
     */
    private _httpsServer: Https.Server;
    /**
     *
     */
    private _injectorService: InjectorService;
    /**
     *
     * @constructor
     */
    constructor() {

        // Configure the ExpressApplication factory.
        InjectorService.factory(ExpressApplication, this.expressApp);
        this._settings = new ServerSettingsProvider();
        this._settings.env = process.env.NODE_ENV || this.expressApp.get("env") || "development";
        this._settings.authentification = ((<any>this).isAuthenticated || (<any>this).$onAuth || new Function()).bind(this);

        const settings =  Metadata.get(SERVER_SETTINGS, this);

        if (settings) {
            this.autoload(settings);
        }
    }

    /**
     * Create a new HTTP server.
     * @returns {ServerLoader}
     */
    public createHttpServer(port: string | number): ServerLoader {
        this._httpServer = Http.createServer(<any> this._expressApp);
        this._settings.httpPort = port;
        return this;
    }

    /**
     * Create a new HTTPs server.
     * @param options
     * @returns {ServerLoader}
     */
    public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {
        this._httpsServer = Https.createServer(options, this._expressApp);
        this._settings.httpsPort = options.port;
        return this;
    }

    /**
     * Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
     * @param args
     * @returns {ServerLoader}
     */
    public use(...args: any[]): ServerLoader {


        /* istanbul ignore else */
        if (this.injectorService) { // Needed to use middlewareInjector

            const middlewareService = this.injectorService.get<MiddlewareService>(MiddlewareService);

            args = args.map((arg) => {

                if (typeof arg === "function") {
                    arg = middlewareService.bindMiddleware(arg);
                }

                return arg;
            });
        }

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
     * Initialize configuration of the express app.
     */
    public initializeSettings(): Promise<any> {

        const settingsService = this.getSettingsService();

        $log.info("[TSED] Import services");
        InjectorService.load();
        this._injectorService = InjectorService.get<InjectorService>(InjectorService);

        const $onMountingMiddlewares = (<any>this).importMiddlewares || (<any>this).$onMountingMiddlewares || new Function; // TODO Fallback
        const $afterRoutesInit = (<any>this).$afterRoutesInit || new Function; // TODO Fallback

        return Promise
            .resolve()
            .then(() => $onMountingMiddlewares.call(this, this.expressApp))
            .then(() => {

                const controllerService = this.injectorService.get<ControllerService>(ControllerService);

                $log.info("[TSED] Import controllers");
                controllerService.load();

                $log.info("[TSED] Routes mounted :");
                controllerService.printRoutes($log);

            })
            .then(() => {

                this.mountStaticDirectories(settingsService.serveStatic);

                return $afterRoutesInit.call(this, this.expressApp);
            })
            .then(() => {

                // Import the globalErrorHandler
                const fnError = (<any>this).$onError;

                /* istanbul ignore next */
                if (fnError) {
                    this.use(fnError.bind(this));
                }

                this.use(GlobalErrorHandlerMiddleware);

            });
    }

    /**
     *
     */
    private getSettingsService(): ServerSettingsService {
        InjectorService.factory(ServerSettingsService, this.settings.$get());
        return InjectorService.get<ServerSettingsService>(ServerSettingsService);
    }
    /**
     *
     */
    private autoload(settings: IServerSettings) {

        $log.info("[TSED] Autoload configuration :");

        this._settings.set(settings);

        const settingsService = this.getSettingsService();

        const bind = (property, value, map) => {

            switch (property) {
                case "mount":
                    Object.keys(settingsService.mount).forEach((key) => this.mount(key, value[key]));
                    break;

                case "componentsScan":
                    settingsService.componentsScan.forEach(componentDir => this.scan(componentDir));
                    break;

                case "httpPort":
                    /* istanbul ignore else */
                    if (this._httpServer === undefined) {
                        this.createHttpServer(value);
                    }

                    break;

                case "httpsPort":

                    /* istanbul ignore else */
                    if (this._httpsServer === undefined) {
                        this.createHttpsServer(Object.assign(map.get("httpsOptions") || {}, {port: value}));
                    }

                    break;
            }
        };

        settingsService
            .forEach((value, key, map) => {
                $log.info(`[TSED] settings.${key} =>`, value);
            });

        settingsService
            .forEach((value, key, map) => {

                /* istanbul ignore else */
                if (value) {
                    bind(key, value, map);
                }
            });


    }

    /**
     * Binds and listen all ports (Http and/or Https). Run server.
     * @returns {Promise<any>|Promise}
     */
    public start(): Promise<any> {

        this.getSettingsService();

        return Promise
            .resolve()
            .then(() => "$onInit" in this ? (this as any).$onInit() : null)
            .then(() => this.initializeSettings())
            .then(() => this.startServers())
            .then(() => {
                if ("$onReady" in this) {
                    (this as any).$onReady();
                }
            })
            .catch((err) => {
                if ("$onServerInitError" in this) {
                    return (<any>this).$onServerInitError(err);
                } else {
                    $log.error("[TSED] HTTP Server error", err);
                }
            });

    }

    /**
     * Initiliaze all servers.
     * @returns {Bluebird<U>}
     */
    private startServers(): Promise<any> {
        let promises: Promise<any>[] = [];
        const settingsService = this.getSettingsService();

        if (this.httpServer) {

            const {address, port} = settingsService.getHttpPort();

            $log.debug(`[TSED] Start HTTP server on ${address}:${port}`);
            this.httpServer.listen(+port, address);

            promises.push(new Promise<any>((resolve, reject) => {
                this._httpServer
                    .on("listening", () => {
                        // The address should be read from server instance but it seems like mocha is failing with this
                        // let { address, port } = this._httpServer.address();
                        $log.info(`[TSED] HTTP Server listen on ${address}:${port}`);
                        resolve();
                    })
                    .on("error", reject);
            }));
        }

        if (this.httpsServer) {

            const {address, port} = settingsService.getHttpsPort();

            $log.debug(`[TSED] Start HTTPs server on ${address}:${port}`);
            this.httpsServer.listen(+port, address);

            promises.push(new Promise<any>((resolve, reject) => {
                this._httpsServer
                    .on("listening", () => {
                        // The address should be read from server instance but it seems like mocha is failing with this
                        // let { address, port } = this._httpsServer.address();
                        $log.info(`[TSED] HTTPs Server listen port ${address}:${port}`);
                        resolve();
                    })
                    .on("error", reject);
            }));
        }


        return Promise.all<any>(promises);

    }

    /**
     * Set the port for http server.
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpPort() is deprecated. Use ServerLoader.settings.port instead of.")
    /* istanbul ignore next */
    public setHttpPort(port: number | string): ServerLoader {

        this._settings.httpPort = port;

        return this;
    }

    /**
     * Set the port for https server.
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpsPort() is deprecated. Use ServerLoader.settings.httpsPort instead of.")
    /* istanbul ignore next */
    public setHttpsPort(port: number | string): ServerLoader {

        this._settings.httpsPort = port;

        return this;
    }

    /**
     * Change the global endpoint path.
     * @param endpoint
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setEndpoint() is deprecated. Use ServerLoader.mount() instead of.")
    /* istanbul ignore next */
    public setEndpoint(endpoint: string): ServerLoader {

        this._settings.endpoint = endpoint;

        return this;
    }

    /**
     * Configure and the directory to find controllers. All controller are mounted on the global endpoint.
     * @param path
     * @param endpoint
     * @returns {ServerLoader}
     */
    public scan(path: string, endpoint: string = this._settings.endpoint): ServerLoader {

        let files: string[] = require("glob").sync(path);
        let nbFiles = 0;

        $log.info("[TSED] Scan files : " + path);


        files
            .forEach(file => {

                try {
                    const exportedClasses = require(file);
                    $log.debug(`[TSED] Import file ${endpoint}:`, file);
                    nbFiles++;

                    Object
                        .keys(exportedClasses)
                        .map(clazzName => exportedClasses[clazzName])
                        .filter(clazz => Metadata.has(CONTROLLER_URL, clazz))
                        .forEach(clazz => {
                            let endpoints = Metadata.get(CONTROLLER_MOUNT_ENDPOINTS, clazz) || [];

                            endpoints.push(endpoint);

                            Metadata.set(CONTROLLER_MOUNT_ENDPOINTS, endpoints, clazz);
                        });

                } catch (er) {
                    /* istanbul ignore next */
                    $log.error(er);
                }

            });


        return this;
    }

    @Deprecated("ServerLoader.onError() is deprecated. Use your own middleware instead of.")
    /* istanbul ignore next */
    public onError() {

    }

    /**
     * Mount all controllers under the `path` parameters to the specified `endpoint`.
     * @param endpoint
     * @param path
     * @returns {ServerLoader}
     */
    public mount(endpoint: string, path: string): ServerLoader {

        this.scan(path, endpoint);

        return this;
    }

    /**
     * Mount statics files in a directories.
     * @param mountDirectories
     * @returns {ServerLoader}
     */
    public mountStaticDirectories(mountDirectories: IServerMountDirectories): ServerLoader {

        /* istanbul ignore else */

        if (mountDirectories) {
            if (require.resolve("serve-static") ) {
                const serveStatic = require("serve-static");

                Object.keys(mountDirectories).forEach(key => {
                    this.use(key, (request, response, next) => {
                        /* istanbul ignore next */
                        if (!response.headersSent) {
                            serveStatic(mountDirectories[key])(request , response, next);
                        } else {
                            next();
                        }
                    });
                });

            }
        }


        return this;
    }

    /**
     * Return the settings provider.
     * @returns {ServerSettingsProvider}
     */
    get settings(): ServerSettingsProvider {
        return this._settings;
    }
    /**
     * Return Express Application instance.
     * @returns {core.Express}
     */
    get expressApp(): Express.Application {
        return this._expressApp;
    }

    /**
     * Return the injectorService initialized by the server.
     * @returns {InjectorService}
     */
    get injectorService(): InjectorService {
        return this._injectorService;
    }

    /**
     * Return Http.Server instance.
     * @returns {Http.Server}
     */
    get httpServer(): Http.Server {
        return this._httpServer;
    }

    /**
     * Return Https.Server instance.
     * @returns {Https.Server}
     */
    get httpsServer(): Https.Server {
        return this._httpsServer;
    }

    @Deprecated("ServerLoader.getExpressApp is deprecated. Use ServerLoader.expressApp instead of.")
    /* istanbul ignore next */
    getExpressApp() {
        return this.expressApp;
    }

    /**
     * Set the mime acceptable to all request. Return a middleware for express.
     * @param mimes
     * @returns {function(Express.Request, Express.Response, Express.NextFunction): any}
     * @constructor
     */
    @Deprecated("ServerLoader.AcceptMime() is deprecated. Use your own middleware instead of.")
    /* istanbul ignore next */
    static AcceptMime(...mimes: string[]): Function {

        return function(req: Express.Request, res: Express.Response, next: Express.NextFunction): any {

            for (let i = 0; i < mimes.length; i++) {
                if (!req.accepts(mimes[i])) {
                    throw new NotAcceptable(mimes[i]);
                }
            }

            next();
        };

    }
}