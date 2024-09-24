import "@tsed/platform-express";

import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";

@Configuration({
  middlewares: [
    cookieParser(),
    compress(),
    methodOverride(),
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: {secure: true}
    })
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set("trust proxy", 1); // trust first proxy
  }
}
