import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/passport";
import "@tsed/platform-express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";

const rootDir = __dirname;

@Configuration({
  componentsScan: [
    `${rootDir}/protocols/*.ts` // scan protocols directory
  ],
  passport: {
    /**
     * Set a custom user info model. By default Ts.ED use UserInfo. Set false to disable Ts.ED json-mapper.
     */
    // userInfoModel: CustomUserInfoModel
  }
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
