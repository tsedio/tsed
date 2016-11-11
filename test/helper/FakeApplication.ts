import * as SuperTest from "supertest";
import {$log} from "ts-log-debug";
import {ServerLoader} from '../../index';
import * as Express from "express";
import * as Bluebird from "bluebird";
import Path = require("path");


export class FakeApplication extends ServerLoader {

    static Server: FakeApplication;
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        
        super();

        let appPath = Path.resolve(__dirname);

        this.setEndpoint('/rest')
            .scan(appPath + "/controllers/**/**.js")
            .scan(appPath + "/services/**/**.js")
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });
        
        this
            .importMiddlewares()
            .importControllers()
            .importGlobalErrorsHanlder();
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public importMiddlewares(): ServerLoader {
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

        return this;
    }

    /**
     * Customize this method to manage all errors emitted by the server and controllers.
     * @param error
     * @param request
     * @param response
     * @param next
     */
    public onError(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): any {

        return super.onError(error, request, response, next);
    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public isAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {

        return request.get("authorization") === "token";
    }
    /**
     * Start your server. Enjoy it !
     * @returns {Promise<U>|Promise<TResult>}
     */
    /*static Initialize(): Bluebird<any> {

        $log.info('Initialize server');

        return new FakeApplication()
            .start()
            .then(() => {
                $log.info('Server started...');
            });
    }*/

    /*public use(endpoint, router) {
        this.list.push({endpoint: endpoint, router:router});
        this.app.use(endpoint, router);
    }*/

    public request(): SuperTest.SuperTest<any> {
        return SuperTest(this.getExpressApp());
    }

    static getInstance(): FakeApplication {

        $log.setRepporting({
            debug: false,
            info: false,
            error: false
        });

        if (FakeApplication.Server === undefined){
            FakeApplication.Server = new FakeApplication();
        }

        return FakeApplication.Server;
    }

}