import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/socketio";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
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
  views: {
    root: `${rootDir}/views`// ,
    // extensions: {
    //   html: "ejs"
    // },
    // viewEngine: "html"
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

    this.app.getApp().set("trust proxy", 1);
  }
}
