import "@tsed/ajv";
import "@tsed/mongoose";
import "@tsed/swagger";
import "../../src/index.js";

import {FileSyncAdapter} from "@tsed/adapters";
import {Configuration, Inject} from "@tsed/di";
import {Constant, PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";

import template from "../template/project.json";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
export {rootDir};

@Configuration({
  port: 8083,
  adapters: {
    Adapter: FileSyncAdapter
  },
  formio: {
    baseUrl: "/projects",
    jwt: {
      secret: "--- change me now ---",
      expireTime: 240
    },
    root: {
      email: "admin@tsed.io",
      password: "admin@tsed.io"
    },
    template
  },
  mongoose: [
    {
      id: "default",
      url: "mongodb://localhost:27017/formioapp"
    }
  ],
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
    },
    {
      path: "/projects/doc",
      specVersion: "2.0",
      fileName: "/../spec.json",
      disableSpec: true,
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
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
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
