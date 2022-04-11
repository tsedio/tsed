import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";

const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

@Configuration({
  port: 3000
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
