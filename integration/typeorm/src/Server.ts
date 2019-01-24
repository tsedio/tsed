import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger";
import "@tsed/typeorm";

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const session = require("express-session");
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  port: 3000,
  acceptMimes: ["application/json"],
  mount: {
    "/v1": `${rootDir}/controllers/**/**Ctrl.{ts,js}`
  },
  typeorm: [
    {
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "",
      database: "romain.lenzotti",
      synchronize: true,
      logging: false,
      entities: [
        `${rootDir}/entity/*{.ts,.js}`
      ],
      migrations: [
        `${rootDir}/migrations/*{.ts,.js}`
      ],
      subscribers: [
        `${rootDir}/subscriber/*{.ts,.js}`
      ]
    }
  ],
  swagger: {
    path: "/api-docs"
  }
})
export class Server extends ServerLoader {
  $onMountingMiddlewares(): void | Promise<any> {
    this
      .use(GlobalAcceptMimesMiddleware)
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
        maxAge: 36000,
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
