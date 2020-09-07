import {Configuration, Constant, Inject, PlatformApplication} from "@tsed/common";
import {ejs} from "consolidate";

const rootDir = __dirname;

@Configuration({
  rootDir,
  viewsDir: `${rootDir}/views`
})
class Server {
  @Configuration()
  settings: Configuration;

  @Constant("viewsDir")
  viewsDir: string;

  @Inject()
  app: PlatformApplication;

  $onInit() {
    this.app.getApp().set("views", this.viewsDir);
    this.app.getApp().engine("ejs", ejs);
  }
}
