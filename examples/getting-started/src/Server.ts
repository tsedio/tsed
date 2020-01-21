import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as cors from "cors";
import {join} from "path";
import {RestCtrl} from "./controllers/RestCtrl";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  logger: {
    debug: true,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  mount: {
    "/rest": [
      RestCtrl, // Manual import (remove it)
      `${rootDir}/controllers/**/*.ts` // Automatic Import, /!\ doesn't works with webpack/jest, use  require.context() or manual import instead
    ]
  },
  componentsScan: [
    "${rootDir}/mvc/**/*.ts",
    "${rootDir}/services/**/*.ts",
    "${rootDir}/middlewares/**/*.ts",
    "${rootDir}/converters/**/*.ts"
  ],
  swagger: [
    {
      path: "/api-docs"
    }
  ],
  calendar: {
    token: true
  },
  statics: {
    "/statics": join(__dirname, "..", "statics")
  }
})
export class Server extends ServerLoader {
  constructor(settings) {
    super(settings);
  }

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  $beforeRoutesInit(): void | Promise<any> {
    this
      .use(cors())
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }
}
