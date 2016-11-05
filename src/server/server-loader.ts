import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";
import * as Promise from "bluebird";
import {Exception, Forbidden, NotAcceptable} from "ts-httpexceptions";
import InjectorService from '../services/injector';
import Controller from "./../controllers/controller";

export interface IHTTPSServerOptions extends Https.ServerOptions {
    port: string | number;
}

export abstract class ServerLoader {

    protected expressApp = Express();
    private endpoint: string = "/";
    private httpServer: Http.Server;
    private httpPort: string | number;
    private httpsServer: Https.Server;
    private httpsPort: string | number;

    constructor() {

        let http  = require("http");

        http.IncomingMessage.prototype.$tryAuth = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

            if (!this.isAuthenticated(request, response, next)) {
                // $log.warn("[TSED] Authentification error");
                next(new Forbidden("Forbidden"));
                return;
            }

            next();
        };
    }

    /**
     * Create a new HTTP server.
     * @returns {ServerLoader}
     */
    public createHttpServer(port: string | number): ServerLoader {
        this.httpServer = Http.createServer(<any> this.expressApp);
        this.httpPort = port;
        return this;
    }

    /**
     * Create a new HTTPs server.
     * @param options
     * @returns {ServerLoader}
     */
    public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {

        this.httpsServer = Https.createServer(options, this.expressApp);
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
     *
     * @returns {ServerLoader}
     */
    public importControllers(): ServerLoader {

        $log.debug("[TSED] Import services");
        InjectorService.load();
        $log.debug("[TSED] Import controllers");
        Controller.load(this.expressApp, this.endpoint);

        $log.info("[TSED] Routes mounted :");
        Controller.printRoutes($log);

        return this;
    }

    /**
     * Return express application instance.
     * @returns {e.Express}
     */
    public getExpressApp(): Express.Application {
        return this.expressApp;
    }

    /**
     * Import the global errors handler middleware to prevent crash server.
     * @returns {ServerLoader}
     */
    public importGlobalErrorsHanlder(): ServerLoader {
        $log.debug("[TSED] Add global errors handler");

        this.use((error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

            try {
                return this.onError(error, request, response, next);
            } catch (err) {
                // console.error(err);
            }
        });

        return this;
    }

    /**
     * Binds and listen all ports (Http and/or Https). Run server.
     * @returns {Promise<any>|Promise}
     */
    public start(): Promise<any> {

        this
            .importMiddlewares()
            .importControllers()
            .importGlobalErrorsHanlder();

        let promises: Promise<any>[] = [];

        if (this.httpServer) {

            $log.debug("[TSED] Start HTTP server on port : " + this.httpPort);

            this.httpServer.listen(this.httpPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this.httpServer
                    .on("listening", () => {
                        $log.info("[TSED] HTTP Server listen port : " + this.httpPort);
                        resolve();
                    })
                    .on("error", function(err){
                        $log.error("[TSED] HTTP Server error", err);
                        reject(err);
                    });
            }));
        }


        if (this.httpsServer) {

            $log.debug("[TSED] Start HTTPs server on port : " + this.httpsPort);

            this.httpsServer.listen(this.httpsPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this.httpsServer
                    .on("listening", () => {
                        $log.info("[TSED] HTTPs Server listen port : " + this.httpsPort);
                        resolve();
                    })
                    .on("error", function(err){
                        $log.error("[TSED] HTTPs Server error", err);
                        reject(err);
                    });
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

        let files: string[] = require('glob').sync(path);
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
     * Register all middlewares used by your express application.
     */
    public abstract importMiddlewares(): ServerLoader;

    /**
     * Catch all exceptions triggered by your express applicaton.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {

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

        if (error.name === "CastError" || error.name === "ObjectID" || error.name === "ValidationError") {
            response.status(400).send("Bad Request");
            return next();
        }

        response.status(error.status || 500).send("Internal Error");
        return next();
    }

    /**
     * Override this method to set your check authentification strategy (Passport.js for example).
     * This method is binded with `Express.Request` object and used by the @Authenticated decorator.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    /* istanbul ignore next */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {
        return true;
    };

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