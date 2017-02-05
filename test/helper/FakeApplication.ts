import * as SuperTest from "supertest";
import {$log} from "ts-log-debug";
import {ServerLoader, IServerLifecycle} from '../../src/index';
import * as Express from "express";
import Path = require("path");


export class FakeApplication extends ServerLoader implements IServerLifecycle {

    static Server: FakeApplication;
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        
        super();

        let appPath = Path.resolve(__dirname);

        this.setEndpoint('/rest')
            .mount('/rest', appPath + "/controllers/**/**.js")
            .scan(appPath + "/services/**/**.js")
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

        let appPath = Path.resolve(__dirname);

        this.engine('.html', require('ejs').__express)
            .set('views', appPath + '/views')
            .set('view engine', 'html');

    }

    /**
     * Set here your check authentification strategy.
     * @param request
     * @param response
     * @param next
     * @returns {boolean}
     */
    public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {

        return request.get("authorization") === "token";
    }

    public request(): SuperTest.SuperTest<SuperTest.Test> {
        return SuperTest(this.expressApp);
    }

    static getInstance(done?: Function): FakeApplication {

        $log.setRepporting({
            debug: false,
            info: false,
            error: true

        });

        if (FakeApplication.Server === undefined){
            FakeApplication.Server = new FakeApplication();
            (FakeApplication.Server as any).initializeSettings().then(done);
        }

        return FakeApplication.Server;
    }

}