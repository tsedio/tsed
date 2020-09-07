import {Configuration, Inject, PlatformApplication} from "@tsed/common";
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

    this.app
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    this.app.getApp().set("trust proxy", 1); // trust first proxy
    this.app.getApp().use(session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: {secure: true}
    }));
  }
}
