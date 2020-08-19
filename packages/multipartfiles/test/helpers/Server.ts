import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/swagger";
import "@tsed/platform-express"
import * as Path from "path";
import "../../src";
import {ArchiveController} from "./controllers/ArchiveController";

const cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  compress = require("compression"),
  methodOverride = require("method-override");

const rootDir = Path.resolve(__dirname);

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: false,
  multer: {},
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/rest": [
      ArchiveController
    ]
  },
  swagger: [
    {
      path: "/api-doc"
    }
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void {
    this
      .app
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
