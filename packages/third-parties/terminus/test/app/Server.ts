import {HealthCheckError} from "@godaddy/terminus";
import "@tsed/ajv";
import {Controller, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {Application} from "express";
import {BeforeShutdown, Health, OnSendFailureDuringShutdown, OnShutdown, OnSignal} from "../../src";

export const rootDir = __dirname;

@Controller("/mongo")
class MongoCtrl {
  @Health("/health")
  health() {
    return Promise.resolve();
  }
}

@Controller("/redis")
class RedisCtrl {
  @Health("/health")
  health() {
    return Promise.reject(
      new HealthCheckError("failed", {
        redis: "down"
      })
    );
  }

  @BeforeShutdown()
  beforeShutdow() {
    console.log("called before shutdown");
  }

  @OnSignal()
  onSignal() {
    console.log("called on signal");
  }

  @OnShutdown()
  onShutdown() {
    console.log("called on shutdown");
  }

  @OnSendFailureDuringShutdown()
  onSendFailureDuringShutdown() {
    console.log("on send failure during shutdown");
  }
}

@Configuration({
  port: 8081,
  mount: {
    "/": [RedisCtrl, MongoCtrl]
  },
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
