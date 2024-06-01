import "@tsed/ajv";
import {Configuration, Constant, Inject, PlatformApplication} from "@tsed/common";
import "@tsed/graphql-ws";
import "@tsed/passport";
import "@tsed/typegraphql";
import * as fs from "fs";
import {buildContext} from "graphql-passport";
import {resolve} from "path";
import {HelloController} from "./controllers/HelloController.js";
import {User} from "./graphql/auth/User.js";
import "./graphql/index";
import {AuthResolver} from "./graphql/index.js";
import "./protocols/GraphQLProtocol";
import "./services/RecipeService";
import "./services/UsersRepository";

const rootDir = __dirname; // automatically replaced by import.meta.dirname on build

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: 8082,
  httpsOptions: {
    key: fs.readFileSync("selfsigned.key"),
    cert: fs.readFileSync("selfsigned.crt")
  },
  logger: {
    level: "info",
    logRequest: true
  },
  mount: {
    "/rest": [HelloController]
  },
  graphql: {
    default: {
      path: "/api/graphql",
      resolvers: [AuthResolver],
      buildSchemaOptions: {
        emitSchemaFile: resolve(rootDir, "../resources/schema.gql")
      },
      serverConfig: {
        csrfPrevention: true,
        cache: "bounded",
        context({req, res}: any) {
          return buildContext({req, res, User});
        }
      }
    }
  },
  passport: {
    userInfoModel: User
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Constant("PLATFORM_NAME")
  platformName: string;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public async $beforeRoutesInit() {
    if (this.platformName === "express") {
      const {default: bodyParser} = await import("body-parser");
      const {default: session} = await import("express-session");
      const {default: compress} = await import("compression");
      const {default: cookieParser} = await import("cookie-parser");
      const {default: methodOverride} = await import("method-override");
      const {default: cors} = await import("cors");

      this.app
        .use(cors())
        .use(bodyParser.json())
        .use(
          bodyParser.urlencoded({
            extended: true
          })
        )
        .use(cookieParser())
        .use(compress({}))
        .use(methodOverride())
        .use(
          session({
            secret: "mysecretkey",
            resave: true,
            saveUninitialized: true,
            // maxAge: 36000,
            cookie: {
              path: "/",
              httpOnly: true,
              secure: false
            }
          })
        );
    } else {
      const {default: bodyParser} = await import("koa-bodyparser");
      const {default: compress} = await import("koa-compress");
      const {default: session} = await import("koa-session");
      const {default: cors} = await import("@koa/cors");
      // @ts-ignore
      const {default: methodOverride} = await import("koa-override");

      // @ts-ignore
      this.app.getApp().keys = ["some secret hurr"];
      this.app
        .use(cors())
        .use(compress())
        .use(methodOverride())
        .use(bodyParser())
        .use(
          session(
            {
              key: "connect.sid" /** (string) cookie key (default is koa.sess) */,
              /** (number || 'session') maxAge in ms (default is 1 days) */
              /** 'session' will result in a cookie that expires when session/browser is closed */
              /** Warning: If a session cookie is stolen, this cookie will never expire */
              maxAge: 86400000,
              /** (boolean) automatically commit headers (default true) */
              overwrite: true,
              /** (boolean) can overwrite or not (default true) */
              httpOnly: false,
              /** (boolean) httpOnly or not (default true) */
              signed: false,
              /** (boolean) signed or not (default true) */
              rolling: false,
              /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
              renew: false,
              /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
              secure: false,
              /** (boolean) secure cookie*/
              sameSite: undefined /** (string) session cookie sameSite options (default null, don't set it) */
            },
            this.app.rawApp as any
          )
        );
    }
  }
}
