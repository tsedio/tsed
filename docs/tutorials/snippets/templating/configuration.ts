import {ServerLoader, ServerSettings} from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cons from "consolidate";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  viewsDir: `${rootDir}/views`,
  mount: {
    "/rest": `${rootDir}/controllers/**/**.js`
  },
  componentsScan: [
    `${rootDir}/services/**/**.js`
  ]
})
class Server extends ServerLoader {
  $onInit() {
    this.set("views", this.settings.get("viewsDir")); // le repertoire des vues
    this.engine("ejs", cons.ejs);
  }

  async $beforeRoutesInit() {
    this.use(ServerLoader.AcceptMime("application/json"))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());
  }
}
