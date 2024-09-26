import "@tsed/platform-express";
import "../../src/index.js";

import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

const rootDir = import.meta.dirname;

@Configuration({
  rootDir,
  port: 8001,
  disableComponentScan: true,
  httpsPort: false
})
export class Server {
  @Inject(PlatformApplication)
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
