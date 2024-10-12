import "@tsed/ajv";
import "@tsed/graphql-ws";
import "@tsed/passport";
import "../../src/index.js";
import "./graphql/index.js";
import "./protocols/GraphQLProtocol.js";
import "./services/RecipeService.js";
import "./services/UsersRepository.js";
import "@tsed/platform-log-request";

import * as fs from "node:fs";
import {join} from "node:path";

import {ApolloContext} from "@tsed/apollo";
import {Configuration, Constant, Inject} from "@tsed/di";
import {PlatformApplication, PlatformContext} from "@tsed/platform-http";
import {buildContext} from "graphql-passport";
import {resolve} from "path";

import {HelloController} from "./controllers/HelloController.js";
import {User} from "./graphql/auth/User.js";
import {AuthResolver} from "./graphql/index.js";
import {pubSub} from "./graphql/pubsub/pubsub.js";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
const rootCert = join(rootDir, "../..");

@Configuration({
  rootDir,
  port: 8001,
  httpsPort: 8082,
  httpsOptions: {
    key: fs.readFileSync(join(rootCert, "selfsigned.key")),
    cert: fs.readFileSync(join(rootCert, "selfsigned.crt"))
  },
  logger: {
    level: "info"
  },
  mount: {
    "/rest": [HelloController]
  },
  apollo: {
    default: {
      path: "/api/graphql",
      resolvers: [AuthResolver],
      buildSchemaOptions: {
        emitSchemaFile: resolve(rootDir, "../resources/schema.gql"),
        pubSub
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

  $alterApolloContext(context: ApolloContext, $ctx: PlatformContext) {
    return buildContext({
      ...context,
      req: $ctx.getRequest(),
      res: $ctx.getResponse(),
      User
    });
  }

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public async $beforeRoutesInit() {
    // @ts-ignore
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
      // @ts-ignore
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
