import {Configuration, Constant, Inject, PlatformApplication} from "@tsed/common";
import cons from "consolidate";

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
    this.app.raw.set("views", this.viewsDir);
    this.app.raw.engine("ejs", cons.ejs);
  }
}
