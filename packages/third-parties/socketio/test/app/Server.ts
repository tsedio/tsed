import "@tsed/ajv";
import "@tsed/platform-express";
import "@tsed/platform-log-request";
import "../../src/index.js";

import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

import {SocketPageCtrl} from "./controllers/pages/SocketPageCtrl.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

export {rootDir};

@Configuration({
  rootDir,
  httpPort: 8001,
  httpsPort: false,
  logger: {
    level: "info"
  },
  mount: {
    "/": [SocketPageCtrl]
  },
  statics: {
    "/": "${rootDir}/views"
  },
  views: {
    root: `${rootDir}/views` // ,
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
