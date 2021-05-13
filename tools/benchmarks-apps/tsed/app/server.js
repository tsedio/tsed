const {Configuration} = require("@tsed/di");
const {__decorate} = require("tslib");
const {AppController} = require("./app.controller");

class Server {
  $beforeRoutesInit() {}
}

Configuration()(Server);

Server = __decorate(
  [
    Configuration({
      logger: {
        level: "off",
        disableBootstrapLog: true,
        disableRoutesSummary: true
      },
      mount: {
        "/": [AppController]
      }
    })
  ],
  Server
);

module.exports.Server = Server;
