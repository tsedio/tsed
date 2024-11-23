import "@tsed/ajv";
import "@tsed/swagger";
import "../../src/index.js";

import {Configuration, Constant, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import compress from "compression";
import {Application} from "express";
import session from "express-session";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
export {rootDir};

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
    "cookie-parser",
    compress({}),
    "method-override",
    {use: "json-parser"},
    {use: "urlencoded-parser"},
    session({
      secret: "keyboard cat", // change secret key
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false // set true if HTTPS is enabled
      }
    }),
    {
      hook: "$afterInit",
      use: (req: any, res: any, next: any) => {
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
