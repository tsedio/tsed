import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

import {TimeslotsController} from "./TimeslotsController.js";

@Configuration({
  logger: {
    disableRoutesSummary: true
  },
  mount: {
    "/": [TimeslotsController]
  }
})
export class Server {
  @Inject(PlatformApplication)
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
