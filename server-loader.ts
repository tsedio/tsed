import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import * as Logger from "log-debug";
import * as Controllers from "./lib/controllers";
import * as Promise from "bluebird";
import * as Glob from "glob";
import * as Httpexceptions from "httpexceptions";

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

        http.IncomingMessage.prototype.$isAuthenticated = (request, response, next) => {

            if (this.isAuthenticated(request, response, next)) {
                return next();
            }

            Logger.warn("[TED] Authentification error");
            next(new Httpexceptions.Forbidden('Forbidden'));
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

        Logger.debug("[ERD] Import controllers");
        Controllers.load(this.expressApp, this.endpoint);

        Logger.info("[ERD] Routes mounted :");
        Controllers.printRoutes();

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
        Logger.debug("[ERD] Add global errors handler");

        this.use((error: any, request: Express.Request, response: Express.Response, next: Function) => {
            try {
                this.onError(error, request, response, next);
            } catch (err) {
                Logger.error("[ERD] Error not catched", err);

                response
                    .status(500)
                    .send("Internal Server error");

                next();
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

            Logger.debug("[ERD] Start HTTP server on port : " + this.httpPort);

            this.httpServer.listen(this.httpPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this.httpServer
                    .on("listening", () => {
                        Logger.info("[ERD] HTTP Server listen port : " + this.httpPort);
                        resolve();
                    })
                    .on("error", function(err){
                        Logger.error("[ERD] HTTP Server error", err);
                        reject(err);
                    });
            }));
        }


        if (this.httpsServer) {

            Logger.debug("[ERD] Start HTTPs server on port : " + this.httpsPort);

            this.httpsServer.listen(this.httpsPort);

            promises.push(new Promise<any>((resolve, reject) => {
                this.httpsServer
                    .on("listening", () => {
                        Logger.info("[ERD] HTTPs Server listen port : " + this.httpsPort);
                        resolve();
                    })
                    .on("error", function(err){
                        Logger.error("[ERD] HTTPs Server error", err);
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

        let files: string[] = Glob.sync(path);
        let nbFiles = 0;

        Logger.info("[ERD] Scan files : " + path);

        files.forEach((file: string) => {
            try {
                Logger.debug("[ERD] Import file :", file);
                require(file);
                nbFiles++;
            } catch (err) {
                Logger.warn("[ERD] Scan error", err);
            }
        });

        Logger.info(`[ERD] ${nbFiles} file(s) found and imported`);

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
    public abstract onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void;

    /**
     * Override this method to set your check authentification strategy (Passport.js for example).
     * This method is binded with `Express.Request` object and used by the @Authenticated decorator.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {
        return true;
    };

    /**
     * Set the mime acceptable to all request. Return a middleware.
     * @param mimes
     * @returns {function(Express.Request, Express.Response, Express.NextFunction): any}
     * @constructor
     */
    static AcceptMime(...mimes: string[]): Function {

        return function(req: Express.Request, res: Express.Response, next: Express.NextFunction): any {

            for(var i = 0; i < mimes.length; i++){
                if (!req.accepts(mimes[0])){
                    throw new Httpexceptions.NotAcceptable(mimes[0]);
                }
            }

            next();
        }

    }
}