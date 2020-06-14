import "@tsed/ajv";
import {
  Configuration,
  GlobalAcceptMimesMiddleware,
  PlatformApplication,
  Inject
} from "@tsed/common";
import "@tsed/platform-express"

const cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  compress = require("compression"),
  methodOverride = require("method-override");

const rootDir = `${__dirname}/src`;

@Configuration({
  rootDir,
  port: 8002,
  httpsPort: false
})
export class TestServer {
  @Inject()
  app: PlatformApplication;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
    this.app
      .use(GlobalAcceptMimesMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.app.raw
      .engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");
  }
}
