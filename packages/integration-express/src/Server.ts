import {Configuration, Inject, Module, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import * as Path from "path";
import {ResourcesCtrl} from "./controllers/ResourcesCtrl";

const cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  compress = require("compression"),
  methodOverride = require("method-override"),
  expressSession = require("express-session");

const rootDir = Path.resolve(__dirname);

@Module({
  rootDir,
  port: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/rest": [ResourcesCtrl]
  },
  // serveStatic: {
  //   "/": "${rootDir}/views"
  // },
  socketIO: {}
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void {
    this.app
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.app.raw
      .engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");

    this.app.raw.set("trust proxy", 1);

    this.app.use(
      expressSession({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {}
      })
    );
  }
}
