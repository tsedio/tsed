import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as methodOverride from "method-override";
import * as path from "path";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8081,
  httpsPort: false,
  logger: {
    debug: true,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  mount: {
    "/rest": [
      `${rootDir}/controllers/**/*.ts` // Automatic Import, /!\ doesn't works with webpack/jest, use  require.context() or manual import instead
    ]
  },
  swagger: [
    {
      path: "/api-docs"
    }
  ],
  calendar: {
    token: true
  },
  statics: {
    "/": path.join(rootDir, "../../client/dist")
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
