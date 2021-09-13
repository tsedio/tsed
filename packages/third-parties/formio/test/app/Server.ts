import {FileSyncAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {Constant, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/mongoose";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import "../../src";
import template from "../template/project.json";

export const rootDir = __dirname;

@Configuration({
  port: 8083,
  adapters: {
    Adapter: FileSyncAdapter
  },
  formio: {
    baseUrl: "/projects",
    jwt: {
      "secret": "--- change me now ---",
      "expireTime": 240
    },
    root: {
      "email": "admin@tsed.io",
      "password": "admin@tsed.io"
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
