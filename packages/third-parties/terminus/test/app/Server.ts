import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/terminus";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {Application} from "express";
import "./services/MongoClient";
import "./services/RedisClient";
import filedirname from "filedirname";

// FIXME remove when esm is ready
const [, rootDir] = filedirname();
export {rootDir};

@Configuration({
  port: 8081,
  terminus: {
    signal: "SIGTERM",
    statusError: 500,
    sendFailuresDuringShutdown: false
  },
  middlewares: [
    cookieParser(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication<Application>;
}
