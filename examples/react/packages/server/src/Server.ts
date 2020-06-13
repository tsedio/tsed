import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import {GlobalAcceptMimesMiddleware} from "@tsed/platform-express";
import "@tsed/swagger";
import "@tsed/typeorm";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import * as path from "path";
import "reflect-metadata";

const rootDir = __dirname;
const clientDir = path.join(rootDir, "../../client/build");

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8081,
  httpsPort: false,
  logger: {
    debug: true,
    logRequest: false,
    requestFields: [
      "reqId",
      "method",
      "url",
      "headers",
      "query",
      "params",
      "duration"
    ]
  },
  mount: {
    "/rest": [
      `${rootDir}/controllers/**/*.ts` // Automatic Import, /!\ doesn"t works with webpack/jest, use  require.context() or manual import instead
    ]
  },
  componentsScan: [
    "${rootDir}/middlewares/**/*.ts",
    "${rootDir}/services/**/*.ts",
    "${rootDir}/converters/**/*.ts",
    "${rootDir}/repositories/**/*.ts"
  ],
  swagger: [
    {
      path: "/api-docs"
    }
  ],
  calendar: {
    token: true
  },
  statics: {
    "/": clientDir
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
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  $beforeRoutesInit(): void | Promise<any> {
    this.app
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );

    return null;
  }

  $afterRoutesInit() {
    this.app.get(`*`, (req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }
}
