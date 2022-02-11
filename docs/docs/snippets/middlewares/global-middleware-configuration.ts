import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {GlobalAcceptMimeMiddleware} from "./GlobalAcceptMimeMiddleware";

const rootDir = __dirname;

@Configuration({
  rootDir,
  componentsScan: [`${rootDir}/middlewares/**/**.js`],
  acceptMimes: ["application/json"] // add your custom configuration here
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInits() {
    this.app.use(GlobalAcceptMimeMiddleware);
  }

  // or
  $afterRoutesInit() {
    this.app.use(GlobalAcceptMimeMiddleware); // But maybe is too late ;)
  }
}
