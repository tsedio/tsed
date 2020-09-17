import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/socketio";
import "@tsed/platform-express";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import {resolve} from "path";
import {SocketPageCtrl} from "./controllers/pages/SocketPageCtrl";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  httpPort: 8001,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/": [SocketPageCtrl]
  },

  statics: {
    "/": "${rootDir}/views"
  },
  socketIO: {}
})
export class Server {
  @Inject()
  app: PlatformApplication;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
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

    this.app.getApp()
      .engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html")
      .set("trust proxy", 1);
  }
}
