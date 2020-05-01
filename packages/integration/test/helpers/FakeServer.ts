import "@tsed/ajv";
import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/graphql";
import "@tsed/swagger";
import {CalendarCtrl} from "../../src/controllers/calendars/CalendarCtrl";
import {EmptyCtrl} from "../../src/controllers/calendars/EmptyCtrl";
import {EventCtrl} from "../../src/controllers/calendars/EventCtrl";
import {HiddenCtrl} from "../../src/controllers/calendars/HiddenCtrl";
import {TaskCtrl} from "../../src/controllers/calendars/TaskCtrl";
import {ErrorsCtrl} from "../../src/controllers/errors/ErrorsCtrl";
import {SocketPageCtrl} from "../../src/controllers/pages/SocketPageCtrl";
import {ProductsCtrl} from "../../src/controllers/products/ProductsCtrl";
import {RestCtrl} from "../../src/controllers/RestCtrl";
import {UserCtrl} from "../../src/controllers/users/UserCtrl";
import "../../src/middlewares/CustomAuthMiddleware";

const rootDir = __dirname + "/../../src";

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
  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
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
}
