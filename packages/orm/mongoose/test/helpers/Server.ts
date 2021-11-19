import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/mongoose";
import "@tsed/platform-express";
import Path from "path";

const cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  compress = require("compression"),
  methodOverride = require("method-override");

const rootDir = Path.resolve(__dirname);

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
