import {$log, GlobalAcceptMimesMiddleware, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger";
import * as BodyParser from "body-parser";
import * as compress from "compression";
import * as CookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import * as Session from "express-session";
// import * as cors from "cors";
import * as methodOverride from "method-override";
import * as path from "path";

dotenv.config();

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/dist");
// In a local dev environment add these to a .env file (but don't commit it)
// In Azure add these as application settings
const {
  clientId = "clientID", // FIXME CHANGE THE default CLIENT_ID
  tenantId,
  UseScopeLevelAuth,
  Scopes
} = process.env;

const level: "info" | "warn" | "error" = "info";
// Application specific scopes.  Define in .env file if to use scopes and what the scopes are
const scopes = UseScopeLevelAuth === "true" ? Scopes.split(",") : null;
$log.info(`Scopes to use: ${scopes}`);

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  port: process.env.PORT || "8081",
  httpsPort: false,
  logger: {
    debug: false,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  componentsScan: [
    `${rootDir}/protocols/**/*.ts`,
    `${rootDir}/services/**/*.ts`,
    `${rootDir}/middlewares/**/*.ts`,
    `${rootDir}/filters/**/*.ts`
  ],
  middlewares: [
    GlobalAcceptMimesMiddleware,
    CookieParser(),
    compress({}),
    methodOverride(),
    BodyParser.json(),
    BodyParser.urlencoded({
      extended: true
    }),
    Session({
      secret: "mysecretkey",
      resave: true,
      saveUninitialized: true,
      cookie: {
        path: "/",
        httpOnly: false,
        secure: false,
        maxAge: null
      }
    })
  ],
  swagger: {
    path: "/api-docs"
  },
  passport: {},
  "azure-bearer": {
    identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
    clientID: clientId,
    validateIssuer: true,
    // issuer: config.creds.issuer,
    // isB2C: config.creds.isB2C,
    // policyName: config.creds.policyName,
    // allowMultiAudiencesInToken: config.creds.allowMultiAudiencesInToken,
    audience: clientId,
    loggingLevel: level,
    loggingNoPII: false,
    // clockSkew: config.creds.clockSkew,
    scope: scopes
  },
  statics: {
    "/": clientDir
  }
})
export class Server {
  @Configuration()
  settings: Configuration;

  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void {
    this.settings
      .get<any[]>("middlewares")
      .forEach((middleware) => this.app.use(middleware));
  }

  $afterRoutesInit(): void {
    this.app.get("/", (req, res) => {
      if (!res.headersSent) {
        // prevent index.html caching
        res.set({
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        });
      }
    });

    this.app.get(`*`, (req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }
}
