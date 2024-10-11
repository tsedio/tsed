import "@tsed/ajv";
import "../../src/index.js";
import "@tsed/swagger";

import {FileSyncAdapter} from "@tsed/adapters";
import {Configuration, Constant, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import {join} from "path";

import {Accounts} from "./services/Accounts.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
export {rootDir};

@Configuration({
  port: 8081,
  // acceptMimes: ['text/html', 'application/json'],
  logger: {
    // level: ""
  },
  adapters: {
    Adapter: FileSyncAdapter
  },
  oidc: {
    Accounts: Accounts,
    jwksPath: join(rootDir, "..", "..", "keys", "jwks.json"),
    clients: [
      {
        client_id: "client_id",
        client_secret: "client_secret",
        redirect_uris: ["http://localhost:3000"],
        response_types: ["id_token"],
        grant_types: ["implicit"],
        token_endpoint_auth_method: "none"
      }
    ],
    claims: {
      openid: ["sub"],
      email: ["email", "email_verified"]
    },
    features: {
      // disable the packaged interactions
      devInteractions: {enabled: false},
      encryption: {enabled: true},
      introspection: {enabled: true},
      revocation: {enabled: true}
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
