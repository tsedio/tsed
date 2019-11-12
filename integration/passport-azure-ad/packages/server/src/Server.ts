import {$log, GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import * as Session from "express-session";
import * as CookieParser from "cookie-parser";
import * as BodyParser from "body-parser";
import * as compress from "compression";
// import * as cors from "cors";
import * as methodOverride from "method-override";
import * as dotenv from "dotenv";
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

@ServerSettings({
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
  azureBearerOptions: {
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
export class Server extends ServerLoader {
  $beforeRoutesInit(): void {
    this.settings
      .get<any[]>("middlewares")
      .forEach((middleware) => this.use(middleware));
  }

  $afterRoutesInit(): void {
    this.expressApp.get(`*`, (req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }
}
