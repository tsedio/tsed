import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import {Application} from "express";
import session from "express-session";
import methodOverride from "method-override";
import "../../src";

export const rootDir = __dirname;

@Configuration({
  port: 8081,
  disableComponentScan: true,
  logger: {
    // level: ""
  }
})
export class Server {
  @Inject()
  app: PlatformApplication<Application>;

  $beforeRoutesInit() {
    this.app
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(
        session({
          secret: "keyboard cat", // change secret key
          resave: false,
          saveUninitialized: true,
          cookie: {
            secure: false // set true if HTTPS is enabled
          }
        })
      );
  }
}
