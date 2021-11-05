import "@tsed/ajv";
import {Constant, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import {Application} from "express";
import session from "express-session";
import methodOverride from "method-override";
import "../../src";

export const rootDir = __dirname;

@Configuration({
  port: 8081,
  logger: {
    level: "info"
  },
  statics: {
    "/": `${rootDir}/public`
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  middlewares: [
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    }),
    session({
      secret: "keyboard cat", // change secret key
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false // set true if HTTPS is enabled
      }
    }),
    {
      hook: "$afterInit", use: (req: any, res: any, next: any) => {
        next();
      }
    },
    (req: any, res: any, next: any) => {
      setTimeout(next, 100);
    }
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication<Application>;

  @Constant("viewsDir")
  viewsDir: string;
}
