import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

@Configuration({
  acceptMimes: ["application/json"],
  middlewares: [cookieParser(), compress({}), methodOverride()]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  public $onInit() {
    console.log("$onInit()");
  }

  public $beforeRoutesInit(): void | Promise<any> {
    console.log("$beforeRoutesInit()");
  }

  public $onReady(): void | Promise<any> {
    console.log("$onReady");
  }
}
