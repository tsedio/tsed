import "./protocols/LoginLocalProtocol.js";
import "@tsed/ajv";
import "@tsed/platform-express";
import "@tsed/swagger";
import {Configuration, Inject} from "@tsed/di";
import {Account} from "./models/Account.js";
import {AuthCtrl} from "./controllers/rest/auth/AuthCtrl.js";
import {MemoryAdapter} from "@tsed/adapters";
import {PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import session from "express-session";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
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
