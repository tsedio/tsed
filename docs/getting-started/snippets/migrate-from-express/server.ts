import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
// import compress from "compression";
// import cookieParser from "cookie-parser";
// import methodOverride from "method-override";

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
  }
}
