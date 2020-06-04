import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/platform-express";
import {ejs} from "consolidate";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  viewsDir: `${rootDir}/views`
})
class Server extends ServerLoader {
  $onInit() {
    this.set("views", this.settings.get("viewsDir"));
    this.engine("ejs", ejs);
  }
}
