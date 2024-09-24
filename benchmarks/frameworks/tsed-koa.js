"use strict";
import {PlatformApplication} from "@tsed/common";
import {Inject} from "@tsed/di";
import {PlatformKoa} from "@tsed/platform-koa";
import {__decorate} from "tslib";

class Server {
  $beforeRoutesInit() {
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
  }
}

__decorate([Inject(PlatformApplication)], Server.prototype, "app");

PlatformKoa.bootstrap(Server, {
  port: process.env.PORT || 3000,
  disableComponentScan: true,
  logger: {
    reqIdBuilder: () => 0,
    level: "off",
    disableBootstrapLog: true,
    disableRoutesSummary: true
  }
}).then((platform) => platform.listen());
