import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
// import * as bodyParser from "body-parser";
// import * as compress from "compression";
// import * as cookieParser from "cookie-parser";
// import * as methodOverride from "method-override";

@Configuration({
  acceptMimes: ["application/json"]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void | Promise<any> {
    // Add middlewares here only when all of your legacy routes are migrated to Ts.ED
    // this.app
    //   .use(cookieParser())
    //   .use(compress({}))
    //   .use(methodOverride())
    //   .use(bodyParser.json())
    //   .use(bodyParser.urlencoded({
    //     extended: true
    //   }));
  }
}
