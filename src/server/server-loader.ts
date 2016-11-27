import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {Exception, Forbidden, NotAcceptable} from "ts-httpexceptions";
import InjectorService from "../services/injector";
import Controller from "./../controllers/controller";

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

    $onReady?(): void;
    $onError?(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void;
    $onAuth?(request: Express.Request, response: Express.Response, next?: Express.NextFunction): boolean | void;
}

/**
 * ServerLoader provider all method to instanciate an ExpressServer.
 *
 * It provide some features :
 *
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 * * Error management (GlobalErrorHandler),
 * * Authentification strategy.
 *
 */
export abstract class ServerLoader {

    /**
     * Application express.
     * @type {core.Express}
     */
    private _expressApp;
    /**
     * Endpoint base.
     * @type {string}
     */
    private endpoint: string = "/rest";
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
    private $tryAuth = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

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
        if(fn){
            const result = fn.call(this, request, response, <Express.NextFunction>callback);

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
     * Initialize configuration of the express app.
     */
    public initializeSettings(): Promise<any> {

        this._expressApp = Express();

        const fn = (<any>this).importMiddlewares || (<any>this).$onMountingMiddlewares || new Function; // TODO Fallback

        return Promise
            .resolve()
            .then(() => fn.call(this, this.expressApp))
            .then(() => {

                $log.info("[TSED] Import services");
                InjectorService.load();

                $log.info("[TSED] Import controllers");
                Controller.load(this.expressApp, this.endpoint);

                $log.info("[TSED] Routes mounted :");
                Controller.printRoutes($log);

                // Import the globalErrorHandler

                const fnError = (<any>this).$onError || (<any>this).onError;

                this.use((error, request, response, next) => {

                    /* istanbul ignore else */
                    if(fnError){
                        fnError.call(this, error, request, response, next);
                    } else {
                        next();
                    }

                });

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
                if ("$onReady" in this){
                    (<any>this).$onReady.call(this);
                }
            })
            .catch((err) => {
                if("$onServerInitError" in this) {
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

            $log.debug("[TSED] Start HTTP server on port : " + this.httpPort);

            this.httpServer.listen(this.httpPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this._httpServer
                    .on("listening", () => {
                        $log.info("[TSED] HTTP Server listen port : " + this.httpPort);
                        resolve();
                    })
                    .on("error", reject);
            }));
        }

        if (this.httpsServer) {

            $log.debug("[TSED] Start HTTPs server on port : " + this.httpsPort);

            this.httpsServer.listen(this.httpsPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this._httpsServer
                    .on("listening", () => {
                        $log.info("[TSED] HTTPs Server listen port : " + this.httpsPort);
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
     * @returns {ServerLoader}
     */
    public scan(path: string): ServerLoader {

        let files: string[] = require("glob").sync(path);
        let nbFiles = 0;

        $log.info("[TSED] Scan files : " + path);

        files.forEach((file: string) => {
            try {
                $log.debug("[TSED] Import file :", file);
                require(file);
                nbFiles++;
            } catch (err) {
                /* istanbul ignore next */
                $log.warn("[TSED] Scan error", err);
            }
        });

        $log.info(`[TSED] ${nbFiles} file(s) found and imported`);

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

        if (typeof error === "string") {
            response.status(404).send(error);
            return next();
        }

        if (error instanceof Exception) {
            response.status(error.status).send(error.message);
            return next();
        }

        // MONGOOSE ERROR MANAGEMENT ... maybe not to be here...
        if (error.name === "CastError" || error.name === "ObjectID" || error.name === "ValidationError") {
            response.status(400).send("Bad Request");
            return next();
        }

        response.status(error.status || 500).send("Internal Error");

        return next();
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