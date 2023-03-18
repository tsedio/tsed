import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import filedirname from "filedirname";
import Path from "path";
import "@tsed/platform-express";
import "@tsed/agenda";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();

@Configuration({
  rootDir,
  port: 8001,
  disableComponentScan: true,
  httpsPort: false
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
