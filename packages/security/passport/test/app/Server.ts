import {MemoryAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import {AuthCtrl} from "./controllers/rest/auth/AuthCtrl.js";
import {Account} from "./models/Account.js";
import "./protocols/LoginLocalProtocol.js";
import session from "express-session";

const rootDir = import.meta.dirname;
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
