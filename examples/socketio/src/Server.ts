import {GlobalAcceptMimesMiddleware, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/socketio";
import "@tsed/swagger";
import * as  bodyParser from "body-parser";
import {ejs} from "consolidate";
import * as methodOverride from "method-override";

const rootDir = __dirname;

@Configuration({
  rootDir,
  viewsDir: `${rootDir}/../views`,
  port: 3008,
  httpsPort: false,
  acceptMimes: ["application/json"],
  mount: {
    "/": `${rootDir}/controllers/pages/**/*.ts`,
    "/rest": `${rootDir}/controllers/rest/**/*.ts`
  },
  statics: {
    "/": [
      "./public",
      "./node_modules"
    ]
  },
  swagger: {
    path: "/docs"
  },
  socketIO: {}
})
export class Server {
  @Configuration()
  settings: Configuration;

  @Inject()
  app: PlatformApplication;

  $beforeInit(): void | Promise<any> {
    this.app.raw.set("views", this.settings.get("viewsDir"));
    this.app.raw.engine("ejs", ejs);
  }

  $beforeRoutesInit() {
    this.app
      .use(GlobalAcceptMimesMiddleware)
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
