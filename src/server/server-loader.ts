import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {Forbidden, NotAcceptable, Exception} from "ts-httpexceptions";
import InjectorService from "../services/injector";
import Controller from "./../controllers/controller";
import Metadata from "../metadata/metadata";
import {CONTROLLER_URL, CONTROLLER_MOUNT_ENDPOINTS} from "../constants/metadata-keys";

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
    $onMountingMiddlewares?(): void | Promise<any>;

    // New lifecycle hooks to configure serveStatic when all routes are initialized
    $afterRoutesInit?(): void | Promise<any>;

    $onReady?(): void;
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
export abstract class ServerLoader {

    /**
     * Application express.
     * @type {core.Express}
     */
    private _expressApp: Express.Application = Express();
    /**
     * Endpoint base.
     * @type {string}
     */
    private endpoint: string = "/rest";
    /**
     *
     * @type {Map<string, string>}
     */
    // private endpointsRules: Map<string, string> = new Map<string, string>();
    /**
     * Instance of httpServer.
     */
    private _httpServer: Http.Server;
    public httpPort: string | number;
    /**
     * Instance of HttpsServer.
     */
    private _httpsServer: Https.Server;
    private httpsPort: string | number;

    /**
     *
     * @constructor
     */
    constructor() {
        this.patchHttp();
    }

    /**
     * Add a new method $tryAuth to the HTTP module.
     * This method is necessary to attach ServerLoader to each incoming message (express request).
     * This method test if the user is authenticated (see ServerLoader.$onAuth())
     * when an Endpoint require authentification before running his method.
     */
    private patchHttp() {
        let http  = require("http");

        http.IncomingMessage.prototype.$tryAuth = this.$tryAuth;
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private $tryAuth = (request: Express.Request, response: Express.Response, next: Express.NextFunction, authorization?: any) => {

        const callback = (result: boolean) => {
            if (result === false) {
                next(new Forbidden("Forbidden"));
                return;
            }
            next();
        };

        // TODO Fallback
        const fn = (<any>this).isAuthenticated || (<any>this).$onAuth;

        /* istanbul ignore else */
        if (fn) {
            const result = fn.call(this, request, response, <Express.NextFunction>callback, authorization);

            /* istanbul ignore else */
            if (result !== undefined) {
                callback(result);
            }

        } else {
            next();
        }

    };

    /**
     * Create a new HTTP server.
     * @returns {ServerLoader}
     */
    public createHttpServer(port: string | number): ServerLoader {
        this._httpServer = Http.createServer(<any> this._expressApp);
        this.httpPort = port;
        return this;
    }

    /**
     * Create a new HTTPs server.
     * @param options
     * @returns {ServerLoader}
     */
    public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {

        this._httpsServer = Https.createServer(options, this._expressApp);
        this.httpsPort = options.port;
        return this;
    }

    /**
     * Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
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
     * Initialize configuration of the express app.
     */
    public initializeSettings(): Promise<any> {

        const $onMountingMiddlewares = (<any>this).importMiddlewares || (<any>this).$onMountingMiddlewares || new Function; // TODO Fallback
        const $afterRoutesInit = (<any>this).$afterCtrlsInit || (this as any).$afterRoutesInit || new Function; // TODO Fallback

        // this.endpointsRules.set("*", this.endpoint);

        $log.info("[TSED] Import services");
        InjectorService.load();

        return Promise
            .resolve()
            .then(() => $onMountingMiddlewares.call(this, this.expressApp))
            .then(() => {

                $log.info("[TSED] Import controllers");
                Controller.load(this.expressApp);

                $log.info("[TSED] Routes mounted :");
                Controller.printRoutes($log);

                // TODO Alex place your serve-static builder here

            })
            .then(() => $afterRoutesInit.call(this, this.expressApp))
            .then(() => {

                // Import the globalErrorHandler

                const fnError = (<any>this).$onError;

                if (fnError) {
                    this.use(fnError.bind(this));
                }

                this.use(this.onError.bind(this));

            });
    }

    /**
     * Binds and listen all ports (Http and/or Https). Run server.
     * @returns {Promise<any>|Promise}
     */
    public start(): Promise<any> {

        return Promise
            .resolve()
            .then(() => "$onInit" in this ? (<any>this).$onInit() : null)
            .then(() => this.initializeSettings())
            .then(() => this.startServers())
            .then(() => {
                if ("$onReady" in this) {
                    (<any>this).$onReady.call(this);
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

        if (this.httpServer) {

            const {address, port} = ServerLoader.buildAddressAndPort(this.httpPort);

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

            const {address, port} = ServerLoader.buildAddressAndPort(this.httpsPort);

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
    public setHttpPort(port: number | string): ServerLoader {

        this.httpPort = port;

        return this;
    }

    /**
     * Set the port for https server.
     * @param port
     * @returns {ServerLoader}
     */
    public setHttpsPort(port: number | string): ServerLoader {

        this.httpsPort = port;

        return this;
    }

    /**
     * Change the global endpoint path.
     * @param endpoint
     * @returns {ServerLoader}
     */
    public setEndpoint(endpoint: string): ServerLoader {

        this.endpoint = endpoint;

        return this;
    }

    /**
     * Configure and the directory to find controllers. All controller are mounted on the global endpoint.
     * @param path
     * @param endpoint
     * @returns {ServerLoader}
     */
    public scan(path: string, endpoint: string = this.endpoint): ServerLoader {

        let files: string[] = require("glob").sync(path);
        let nbFiles = 0;

        $log.info("[TSED] Scan files : " + path);


        files
            .forEach(file => {

                try {
                    const exportedClasses = require(file);
                    $log.debug("[TSED] Import file :", file);
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

    /**
     * Mount all controllers under the `path` parameters to the specified `endpoint`.
     * @param endpoint
     * @param path
     * @returns {ServerLoader}
     */
    public mount(endpoint: string, path: string): ServerLoader {

       // this.endpointsRules.set(path, endpoint);
        this.scan(path, endpoint);

        return this;
    }

    /**
     * Return Express Application instance.
     * @returns {core.Express}
     */
    get expressApp(): Express.Application {
        return this._expressApp;
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

    // TODO deprecated
    /** istanbul ignore next */
    getExpressApp = () => this.expressApp;

    /**
     * Default global handler
     * @param error
     * @param request
     * @param response
     * @param next
     */
    protected onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {
        if (response.headersSent) {
            return next(error);
        }

        if (error instanceof Exception) {
            response.status(error.status).send(error.message);
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(error);
            return next();
        }

        response.status(error.status || 500).send("Internal Error");

        return next();
    }

    /**
     *
     * @param addressPort
     * @returns {{address: string, port: (string|number)}}
     */
    private static buildAddressAndPort(addressPort: string | number): {address: string, port: number} {
        let address = "0.0.0.0";
        let port = addressPort;

        if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
            [address, port] = addressPort.split(":");
        }

        return {address, port: +port};
    }

    /**
     * Set the mime acceptable to all request. Return a middleware for express.
     * @param mimes
     * @returns {function(Express.Request, Express.Response, Express.NextFunction): any}
     * @constructor
     */
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