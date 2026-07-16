import "../../src/index.js";
import "./services/MongoClient.js";
import "./services/RedisClient.js";
import "@tsed/ajv";
import {Configuration, Inject} from "@tsed/di";
import {Application} from "express";
import {PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build
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
