import "@tsed/ajv";
import {Configuration, GlobalAcceptMimesMiddleware, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/graphql";
import "@tsed/swagger";
import "@tsed/platform-express";
import {CalendarCtrl} from "../../src/controllers/calendars/CalendarCtrl";
import {EmptyCtrl} from "../../src/controllers/calendars/EmptyCtrl";
import {EventCtrl} from "../../src/controllers/calendars/EventCtrl";
import {HiddenCtrl} from "../../src/controllers/calendars/HiddenCtrl";
import {TaskCtrl} from "../../src/controllers/calendars/TaskCtrl";
import {ErrorsCtrl} from "../../src/controllers/errors/ErrorsCtrl";
import {SocketPageCtrl} from "../../src/controllers/pages/SocketPageCtrl";
import {UserCtrl} from "../../src/controllers/users/UserCtrl";
import {FeatureModule} from "../../src/module/feature/FeatureModule";

const rootDir = __dirname + "/../../src";

@Configuration({
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
      UserCtrl,
      ErrorsCtrl
    ]
  },
  componentsScan: [
    `${rootDir}/services/**/**.ts`,
    `${rootDir}/graphql/**/*.ts`
  ],
  statics: {
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
  },
  imports: [
    FeatureModule
  ]
})
export class FakeServer {
  @Inject()
  app: PlatformApplication;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void {
    const cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      compress = require("compression"),
      methodOverride = require("method-override");

    this.app
      .use(GlobalAcceptMimesMiddleware)
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());

    this.app.raw
      .engine(".html", require("ejs").__express)
      .set("views", `${rootDir}/views`)
      .set("view engine", "html");
  }
}
