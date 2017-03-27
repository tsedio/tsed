
import * as Express from "express";
import {$log} from "ts-log-debug";
import {ServerLoader} from "../../src/index";
import Path = require("path");
import TestAcceptMimeMiddleware from "./middlewares/acceptmime";
import {ServerSettings} from "../../src/decorators/class/server-settings";

$log.setPrintDate(true);

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    port: 8000,
    httpsPort: 8080,
    mount: {
        '/rest': `${rootDir}/controllers/**/**.js`,
        '/rest/v1': `${rootDir}/controllers/**/**.js`
    },

    componentsScan: [
        `${rootDir}/services/**/**.js`
    ],

    uploadDir: `${rootDir}/uploads`,

    serveStatic: {
        '/': `${rootDir}/views`
    }
})
export class ExampleServer extends ServerLoader {

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
            .use(morgan('dev'))
            .use(TestAcceptMimeMiddleware)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        this.engine('.html', require('ejs').__express)
            .set('views', './views')
            .set('view engine', 'html');
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