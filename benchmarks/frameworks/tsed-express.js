"use strict";
import {PlatformApplication} from "@tsed/common";
import {Inject} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {__decorate} from "tslib";

class Server {
  $onInit() {
    this.app.getApp().disable("etag");
    this.app.getApp().disable("x-powered-by");
  }

  $beforeRoutesInit() {
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
  }
}

__decorate([Inject(PlatformApplication)], Server.prototype, "app");

PlatformExpress.bootstrap(Server, {
  port: process.env.PORT || 3000,
  disableComponentScan: true,
  logger: {
    reqIdBuilder: () => 0,
    level: "off",
    disableBootstrapLog: true,
    disableRoutesSummary: true
  }
}).then((platform) => platform.listen());
