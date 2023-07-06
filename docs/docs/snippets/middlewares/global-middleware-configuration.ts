import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {GlobalAcceptMimeMiddleware} from "./GlobalAcceptMimeMiddleware";

@Configuration({
  acceptMimes: ["application/json"] // add your custom configuration here
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit() {
    this.app.use(GlobalAcceptMimeMiddleware);
  }

  // or
  $afterRoutesInit() {
    this.app.use(GlobalAcceptMimeMiddleware); // But maybe is too late ;)
  }
}
