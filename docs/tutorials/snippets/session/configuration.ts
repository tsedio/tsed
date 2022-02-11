import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as methodOverride from "method-override";

@Configuration({})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set("trust proxy", 1); // trust first proxy

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
          secret: "keyboard cat",
          resave: false,
          saveUninitialized: true,
          cookie: {secure: true}
        })
      );
  }
}
