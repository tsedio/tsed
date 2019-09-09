import "@tsed/ajv";
import {ProviderScope, ProviderType, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/graphql";
import "@tsed/mongoose";
import "@tsed/multipartfiles";
import {PassportCtrl} from "@tsed/passport";
import "@tsed/seq";
import "@tsed/socketio";
import {Docs} from "@tsed/swagger";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {ErrorsCtrl} from "./controllers/errors/ErrorsCtrl";
import {SocketPageCtrl} from "./controllers/pages/SocketPageCtrl";
import {ProductsCtrl} from "./controllers/products/ProductsCtrl";

import {RestCtrl} from "./controllers/RestCtrl";
import TestAcceptMimeMiddleware from "./middlewares/acceptmime";
import "./middlewares/CustomAuthMiddleware";
import {InitSessionMiddleware} from "./middlewares/InitSessionMiddleware";
import {NotFoundMiddleware} from "./middlewares/NotFoundMiddleware";

const rootDir = Path.resolve(__dirname);
const spec = require(`${rootDir}/spec/swagger.default.json`);

Docs("authentication")(PassportCtrl);

@ServerSettings({
  rootDir,
  port: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/": [SocketPageCtrl],
    "/rest": [
      "${rootDir}/controllers/Base/**.ts",
      "${rootDir}/controllers/calendars/**.ts",
      ErrorsCtrl,
      RestCtrl,
      ProductsCtrl,
      PassportCtrl
    ],
    "/rest/v1": "${rootDir}/controllers/{calendars,users}/**.ts"
  },

  componentsScan: ["${rootDir}/services/**/*.ts", "${rootDir}/graphql/**/*.ts"],

  uploadDir: "${rootDir}/uploads",

  serveStatic: {
    "/": "${rootDir}/views"
  },
  graphql: {
    "default": {
      "path": "/api/graphql"
    }
  },
  socketIO: {},
  swagger: [
    {
      path: "/api-doc",
      cssPath: "${rootDir}/spec/style.css",
      showExplorer: true,
      spec
    },
    {
      path: "/auth",
      doc: "authentication",
      cssPath: "${rootDir}/spec/style.css",
      showExplorer: true,
      spec
    },
    {
      path: "/errors-doc",
      doc: "errors",
      showExplorer: true,
      spec
    },
    {
      path: "/hidden-doc",
      doc: "hidden",
      showExplorer: true,
      spec
    }
  ],
  scopes: {
    [ProviderType.CONTROLLER]: ProviderScope.REQUEST
  },
  seq: {
    url: "http://localhost:5341"
  }
})
export class ExampleServer extends ServerLoader {
  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override"),
      expressSession = require("express-session");

    this.use(TestAcceptMimeMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");

    this.set("trust proxy", 1);
    this.use(
      expressSession({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {}
      })
    );

    this.use(InitSessionMiddleware);
  }

  public $afterRoutesInit() {
    this.use(NotFoundMiddleware);
  }

  /**
   *
   */
  public $onReady() {
    $log.info("Server started...");
  }

  public onServerInitError() {
  }
}

if (process.env.NODE_ENV !== "test") {
  async function bootstrap() {
    try {
      const server = await ServerLoader.bootstrap(ExampleServer);
      await server.listen();
    } catch (er) {
      console.error(er);
    }
  }

  bootstrap();
}
