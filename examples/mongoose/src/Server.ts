import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/mongoose";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import mongooseConfig from "./config/mongoose";
import {IndexCtrl} from "./controllers/pages/IndexCtrl";
import {CalendarsCtrl} from "./controllers/rest/calendars/CalendarsCtrl";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  mongoose: mongooseConfig,
  mount: {
    "/rest": [CalendarsCtrl],
    "/": [IndexCtrl]
  },
  componentsScan: [],
  swagger: [
    {
      path: "/v2/docs",
      specVersion: "2.0"
    },
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
