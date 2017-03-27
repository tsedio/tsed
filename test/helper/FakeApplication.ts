import * as SuperTest from "supertest";
import {$log} from "ts-log-debug";
import {ServerLoader, ServerSettings} from '../../src/index';
import * as Express from "express";
import Path = require("path");
import {} from "../../src/decorators/class/server-settings";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    port: 8000,
    httpsPort: 8080,
    mount: {
        '/rest': `${rootDir}/controllers/**/**.js`
    },
    componentsScan: [
        `${rootDir}/services/**/**.js`
    ],
    serveStatic: {
        '/': `${rootDir}/views`
    }
})
export class FakeApplication extends ServerLoader {

    static Server: FakeApplication;

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
            error: false
        });

        if (FakeApplication.Server === undefined){
            FakeApplication.Server = new FakeApplication();
            (FakeApplication.Server as any).initializeSettings().then(done);
        }

        return FakeApplication.Server;
    }

}