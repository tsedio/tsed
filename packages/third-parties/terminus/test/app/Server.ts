import "@tsed/ajv";
import "../..";
import "./services/MongoClient.js";
import "./services/RedisClient.js";

import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import type {Application} from "express";

const rootDir = import.meta.dirname;
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
  @Inject(PlatformApplication)
  app: PlatformApplication<Application>;
}
