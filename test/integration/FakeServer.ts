import * as Express from "express";
import {GlobalAcceptMimesMiddleware} from "../../src/mvc/components/GlobalAcceptMimesMiddleware";
import {ServerLoader} from "../../src/server/components/ServerLoader";
import {ServerSettings} from "../../src/server/decorators/serverSettings";
import "../../src/swagger";
import "./app/middlewares/authentication";
import Path = require("path");

const rootDir = Path.join(Path.resolve(__dirname), "app");

@ServerSettings({
    rootDir,
    port: 8002,
    httpsPort: 8082,
    mount: {
        "/rest": `${rootDir}/controllers/**/**.js`
    },
    componentsScan: [
        `${rootDir}/services/**/**.js`
    ],
    serveStatic: {
        "/": `${rootDir}/views`
    },
    acceptMimes: ["application/json"],
    swagger: {
        spec: require(`${rootDir}/spec/swagger.default.json`),
        path: "/api-doc"
    }
})
export class FakeServer extends ServerLoader {

    static Server: FakeServer;

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void {

        let cookieParser = require("cookie-parser"),
            bodyParser = require("body-parser"),
            compress = require("compression"),
            methodOverride = require("method-override"),
            session = require("express-session");

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        this.engine(".html", require("ejs").__express)
            .set("views", `${rootDir}/views`)
            .set("view engine", "html");

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
}
