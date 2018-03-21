import "@tsed/ajv";
import {ProviderScope, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/socketio";
import "@tsed/swagger";
import * as Path from "path";
import {$log} from "ts-log-debug";

import {RestCtrl} from "./controllers/RestCtrl";
import TestAcceptMimeMiddleware from "./middlewares/acceptmime";

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    rootDir,
    port: 8001,
    httpsPort: 8071,
    debug: true,
    mount: {
        "/rest": [
            "${rootDir}/controllers/Base/**.js",
            "${rootDir}/controllers/calendars/**.ts",
            RestCtrl
        ],
        "/rest/v1": "${rootDir}/controllers/**/**.ts"
    },

    componentsScan: [
        "${rootDir}/services/**/**.js"
    ],

    uploadDir: "${rootDir}/uploads",

    serveStatic: {
        "/": "${rootDir}/views"
    },
    swagger: {
        path: "/api-doc",
        cssPath: "${rootDir}/spec/style.css",
        showExplorer: true,
        spec: require(`${rootDir}/spec/swagger.default.json`)
    },
    controllerScope: ProviderScope.REQUEST
})
export class ExampleServer extends ServerLoader {

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
            .use(TestAcceptMimeMiddleware)
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }))
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride());

        this.engine(".html", require("ejs").__express)
            .set("views", "./views")
            .set("view engine", "html");
    }

    /**
     *
     */
    public $onReady() {
        $log.info("Server started...");
    }

}

if (process.env.NODE_ENV !== "test")
    new ExampleServer().start().catch((er) => {
        console.error(er);
    });