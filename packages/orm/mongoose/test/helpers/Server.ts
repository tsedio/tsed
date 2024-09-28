import "../../src/index.js";
import "@tsed/platform-express";

import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

const rootDir = __dirname; // automatically replaced by import.meta.dirname on build

@Configuration({
  rootDir,
  port: 8001,
  disableComponentScan: true,
  httpsPort: false,
  logger: {
    level: "info",
    logRequest: true
  }
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
  }
}
