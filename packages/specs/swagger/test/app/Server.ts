import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger";
import Path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";

const rootDir = Path.resolve(__dirname);

@Configuration({
  rootDir,
  port: 8001,
  disableComponentScan: true,
  swagger: [
    {
      path: "/v2/doc",
      specVersion: "2.0",
      showExplorer: true,
      spec: {
        info: {title: "Swagger title", version: "1.2.0"}
      }
    },
    {
      path: "/v3/doc",
      specVersion: "3.0.1",
      showExplorer: true
    }
  ]
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
