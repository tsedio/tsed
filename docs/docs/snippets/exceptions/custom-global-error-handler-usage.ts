import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {GlobalErrorHandlerMiddleware} from "./middlewares/GlobalErrorHandlerMiddleware";

@Configuration({})
export class Server {
  @Inject()
  app: PlatformApplication;

  $afterRoutesInit() {
    this.app.use(GlobalErrorHandlerMiddleware);
  }
}
