import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import {CreateRequestSessionMiddleware} from "./middlewares/CreateRequestSessionMiddleware";

@Configuration({
  middlewares: [
    cookieParser(),
    compress({}),
    methodOverride(),
    session({
      secret: "keyboard cat", // change secret key
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false // set true if HTTPS is enabled
      }
    }),
    CreateRequestSessionMiddleware
  ]
})
class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set("trust proxy", 1); // trust first proxy
  }
}
