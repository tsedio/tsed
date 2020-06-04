import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/passport";
import "@tsed/platform-express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as methodOverride from "method-override";

const rootDir = __dirname;

@Configuration({
  componentsScan: [
    `${rootDir}/protocols/*{.ts,.js}` // scan protocols directory
  ],
  passport: {}
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit() {
    this.app
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      // @ts-ignore
      .use(session({
        secret: "mysecretkey",
        resave: true,
        saveUninitialized: true,
        // maxAge: 36000,
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }));
  }
}
