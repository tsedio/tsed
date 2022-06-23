import {Configuration, Inject} from "@tsed/di";
import {TimeslotsController} from "./TimeslotsController";
import {PlatformApplication} from "@tsed/common";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";

@Configuration({
  logger: {
    disableRoutesSummary: true
  },
  mount: {
    "/": [TimeslotsController]
  }
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
