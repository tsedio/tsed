import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/socketio";
import "@tsed/swagger";
import * as  bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as methodOverride from "method-override";

const rootDir = __dirname;

@Configuration({
  rootDir,
  port: 3008,
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
  swagger: [{
    path: "/docs"
  }],
  socketIO: {},
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs",
    extensions: {
      html: "ejs"
    }
  }
})
export class Server {
  @Configuration()
  settings: Configuration;

  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit() {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }
}
