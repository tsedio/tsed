"use strict";
import {PlatformExpress} from "@tsed/platform-express";
import {__decorate} from "tslib";
import {Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";

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
  $$disableIncomingEvent: true,
  $$disableEvents: true,
  $$disableLoggerContext: true,
  disableComponentScan: true,
  logger: {
    level: "off",
    disableBootstrapLog: true,
    disableRoutesSummary: true
  }
}).then((platform) => platform.listen());
