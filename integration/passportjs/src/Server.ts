import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import {$log} from "ts-log-debug";

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const session = require("express-session");
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
  logger: {
    debug: false,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  swagger: {
    path: "/api-docs"
  },
  calendar: {
    token: true
  },
  passport: {}
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  $onMountingMiddlewares(): void | Promise<any> {
    this
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
        secret: "mysecretkey",
        resave: true,
        saveUninitialized: true,
        maxAge: 36000,
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }));

    return null;
  }

  $onReady() {
    $log.debug("Server initialized");
  }

  $onServerInitError(error): any {
    $log.error("Server encounter an error =>", error);
  }
}
