import {PlatformApplication} from "@tsed/common";
import {Configuration} from "@tsed/di";
import {Inject} from "@tsed/di/src";
import "@tsed/platform-express";
import "@tsed/swagger";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as methodOverride from "method-override";
import {RestCtrl} from "./controllers/RestCtrl";
import {CreateRequestSessionMiddleware} from "./middlewares/CreateRequestSessionMiddleware";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  mount: {
    "/rest": [
      RestCtrl
    ]
  },
  swagger: {
    path: "/api-docs"
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set("trust proxy", 1); // trust first proxy

    this.app
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
        secret: "keyboard cat", // change secret key
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false // set true if HTTPS is enabled
        }
      }))
      .use(CreateRequestSessionMiddleware);
  }
}
