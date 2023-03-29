import {MemoryAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import filedirname from "filedirname";
import methodOverride from "method-override";
import Path from "path";
import {AuthCtrl} from "./controllers/rest/auth/AuthCtrl";
import {Account} from "./models/Account";
import "./protocols/LoginLocalProtocol";
import session from "express-session";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();
export {rootDir};

@Configuration({
  rootDir,
  port: 8001,
  adapters: {
    Adapter: MemoryAdapter,
    lowdbDir: `${rootDir}/../../.db`
  },
  mount: {
    "/": [AuthCtrl]
  },
  passport: {
    userInfoModel: Account
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void {
    this.app
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(
        session({
          secret: "mysecretkey",
          resave: true,
          saveUninitialized: true,
          // maxAge: 36000,
          cookie: {
            path: "/",
            httpOnly: true,
            secure: false
          }
        })
      );
  }
}
