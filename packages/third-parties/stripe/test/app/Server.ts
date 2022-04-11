import {FileSyncAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {Constant, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/stripe";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";

export const rootDir = __dirname;

@Configuration({
  port: 8081,
  adapters: {
    Adapter: FileSyncAdapter
  },
  stripe: {
    apiKey: "the_api_key",
    apiVersion: "2020-08-27",
    webhooks: {
      secret: "whsec_test_secret",
      tolerance: 1
    }
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  swagger: [
    {
      path: "/v3/doc",
      specVersion: "3.0.1",
      showExplorer: true
    }
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Constant("viewsDir")
  viewsDir: string;

  $beforeRoutesInit() {
    this.app
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
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
