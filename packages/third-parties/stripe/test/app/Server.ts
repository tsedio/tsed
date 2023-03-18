import {FileSyncAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import {Configuration} from "@tsed/di";
import "@tsed/stripe";
import "@tsed/swagger";
import filedirname from "filedirname";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();
export {rootDir};

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
  middlewares: [
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    {use: "urlencoded-parser", options: {extended: true}},
    {
      use: "express-session",
      options: {
        secret: "keyboard cat", // change secret key
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false // set true if HTTPS is enabled
        }
      }
    }
  ],
  swagger: [
    {
      path: "/v3/doc",
      specVersion: "3.0.1",
      showExplorer: true
    }
  ]
})
export class Server {}
