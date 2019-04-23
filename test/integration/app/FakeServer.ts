import "@tsed/ajv";
import "@tsed/graphql";
import "@tsed/swagger";
import * as Express from "express";
import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "../../../packages/common/src/server";
import {CalendarCtrl} from "./controllers/calendars/CalendarCtrl";
import {EmptyCtrl} from "./controllers/calendars/EmptyCtrl";
import {EventCtrl} from "./controllers/calendars/EventCtrl";
import {HiddenCtrl} from "./controllers/calendars/HiddenCtrl";
import {TaskCtrl} from "./controllers/calendars/TaskCtrl";
import {ErrorsCtrl} from "./controllers/errors/ErrorsCtrl";
import {SocketPageCtrl} from "./controllers/pages/SocketPageCtrl";
import {ProductsCtrl} from "./controllers/products/ProductsCtrl";
import {RestCtrl} from "./controllers/RestCtrl";
import {UserCtrl} from "./controllers/users/UserCtrl";
import "./middlewares/CustomAuthMiddleware";

const rootDir = __dirname;

@ServerSettings({
  rootDir,
  port: 8002,
  httpsPort: 8082,
  mount: {
    "/rest": [
      CalendarCtrl,
      EmptyCtrl,
      EventCtrl,
      HiddenCtrl,
      TaskCtrl,
      SocketPageCtrl,
      ProductsCtrl,
      UserCtrl,
      RestCtrl,
      ErrorsCtrl
    ]
  },
  componentsScan: [
    `${rootDir}/services/**/**.ts`,
    `${rootDir}/graphql/**/*.ts`
  ],
  serveStatic: {
    "/": `${rootDir}/views`
  },
  acceptMimes: ["application/json"],
  swagger: {
    spec: require(`${rootDir}/spec/swagger.default.json`),
    path: "/api-doc"
  },
  graphql: {
    "default": {
      "path": "/api/graphql"
    }
  }
})
export class FakeServer extends ServerLoader {
  // tslint:disable-next-line: variable-name
  static Server: FakeServer;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override");

    this.use(GlobalAcceptMimesMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");
  }

  /**
   * Set here your check authentification strategy.
   * @param request
   * @param response
   * @param next
   * @returns {boolean}
   */
  public $onAuth(request: Express.Request, response: Express.Response, next: Express.NextFunction): boolean {
    return request.get("authorization") === "token";
  }
}
