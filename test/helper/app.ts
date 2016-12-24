
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerLoader, IServerLifecycle} from "../../src/index";
import Path = require("path");

$log.setPrintDate(true);

/**
 * Create a new Server that extends ServerLoader.
 */
export class ExampleServer extends ServerLoader implements IServerLifecycle {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        let appPath = Path.resolve(__dirname);

        this.setEndpoint('/rest')
            .mount("/rest", appPath + "/controllers/**/**.js")
            .mount("/rest/v1", appPath + "/controllers/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void {
        let morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override'),
            session = require('express-session');

        this
        //.use(morgan('dev'))
            .use(ServerLoader.AcceptMime("application/json"))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

    }

    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public $onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        next();
    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        next(request.get("authorization") === "token");
    }

    /**
     *
     */
    public $onReady() {
        $log.info('Server started...');
    }

    /**
     * Start your server. Enjoy it !
     * @returns {Promise<U>|Promise<TResult>}
     */
    static Initialize(): Promise<any> {

        $log.info('Initialize server');

        return new ExampleServer().start();
    }

}

ExampleServer.Initialize();