import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import {resolve} from "path";
import "@tsed/platform-express";

import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";

const rootDir = resolve(__dirname);

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: false,
  disableComponentScan: true,
  logger: {
    level: "info",
    logRequest: true
  }
})
export class Server {
  @Inject()
  app!: PlatformApplication;

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
