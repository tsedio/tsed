const {printMemory} = require("../../printMemory");
const {PlatformApplication} = require("@tsed/common");
const {Configuration, Inject} = require("@tsed/di");
const {__decorate} = require("tslib");

class Server {
  $beforeRoutesInit() {
    this.app.get("/", (req, res) => {
      printMemory();
      res.send("Hello world!");
    });
  }
}

__decorate([Inject(PlatformApplication)], Server.prototype, "app");

Configuration()(Server);

Server = __decorate(
  [
    Configuration({
      logger: {
        level: "off",
        disableBootstrapLog: true,
        disableRoutesSummary: true
      }
    })
  ],
  Server
);

module.exports.Server = Server;
