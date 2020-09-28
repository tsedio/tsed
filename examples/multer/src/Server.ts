import {Configuration, GlobalAcceptMimesMiddleware, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
// import "./middlewares/MultipartFilesOverrided"; // Uncomment to enable the upload middleware override

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json", "multipart/form-data"],
  httpPort: 8091,
  logger: {
    debug: false,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  swagger: [{
    path: "/api-docs"
  }]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void | Promise<any> {
    this.app
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }
}
