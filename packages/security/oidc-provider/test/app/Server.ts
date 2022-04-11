import {FileSyncAdapter} from "@tsed/adapters";
import "@tsed/ajv";
import "@tsed/engines";
import {Constant, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/oidc-provider";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import methodOverride from "method-override";
import {join} from "path";
import {Accounts} from "./services/Accounts";

export const rootDir = __dirname;

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
    jwksPath: join(__dirname, "..", "..", "keys", "jwks.json"),
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
