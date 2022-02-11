import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as methodOverride from "method-override";

const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

@Configuration({
  port: 3000,
  rootDir: __dirname
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit() {
    this.app
      .use(compress())
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(awsServerlessExpressMiddleware.eventContext());
  }
}
