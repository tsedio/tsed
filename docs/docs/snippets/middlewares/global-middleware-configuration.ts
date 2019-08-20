import {ServerLoader, ServerSettings} from "@tsed/common";
import {GlobalAcceptMimeMiddleware} from "./GlobalAcceptMimeMiddleware";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  componentsScan: [
    `${rootDir}/middlewares/**/**.js`
  ],
  acceptMimes: ["application/json"]  // add your custom configuration here
})
export class Server extends ServerLoader {
  $beforeRoutesInits() {
    this.use(GlobalAcceptMimeMiddleware);
  }

  // or
  $afterRoutesInit() {
    this.use(GlobalAcceptMimeMiddleware); // But maybe is too late ;)
  }
}
