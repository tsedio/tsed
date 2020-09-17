import {Constant, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import {ejs} from "consolidate";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as methodOverride from "method-override";
import "../../src";

export const rootDir = __dirname;

@Configuration({
  port: 8081,
  logger: {
    // level: ""
  },
  statics: {
    "/": `${rootDir}/public`
  },
  viewsDir: `${rootDir}/views`
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Constant("viewsDir")
  viewsDir: string;

  $beforeRoutesInit() {
    this.app.getApp().set("views", this.viewsDir);
    this.app.getApp().engine("ejs", ejs);

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
