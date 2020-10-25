import {GlobalAcceptMimesMiddleware, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/passport";
import "@tsed/platform-express";
import "@tsed/swagger";
import "@tsed/typeorm";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as session from "express-session";
import * as methodOverride from "method-override";
import {User} from "./entities/User";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  httpPort: process.env.PORT || 8083,
  acceptMimes: ["application/json"],
  mount: {
    "/v1": [
      `${rootDir}/controllers/**/**Ctrl.{ts,js}`
    ]
  },
  componentsScan: [
    `${rootDir}/services/*{.ts,.js}`,
    `${rootDir}/repositories/*{.ts,.js}`,
    `${rootDir}/protocols/*{.ts,.js}`
  ],
  passport: {
    userInfoModel: User
  },
  typeorm: [
    {
      name: "default",
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: 5432,
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "changeme",
      database: process.env.POSTGRES_DB || "postgres",
      logging: false,
      synchronize: true,
      entities: [
        `${rootDir}/entities/*{.ts,.js}`
      ],
      migrations: [
        `${rootDir}/migrations/*{.ts,.js}`
      ],
      subscribers: [
        `${rootDir}/subscriber/*{.ts,.js}`
      ]
    }
  ],
  swagger: [{
    path: "/api-docs",
    spec: {
      securityDefinitions: {
        "auth:basic": {
          type: "basic"
        }
      }
    }
  }]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void | Promise<any> {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
        secret: "mysecretkey",
        resave: true,
        saveUninitialized: true,
        // maxAge: 36000,
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }));

    return null;
  }
}
