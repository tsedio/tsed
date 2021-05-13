const {Controller, Get} = require("@tsed/common");
const {__decorate, __metadata} = require("tslib");

class AppController {
  get() {
    return "Hello world!";
  }
}

__decorate(
  [Get("/"), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", String)],
  AppController.prototype,
  "get",
  null
);

AppController = __decorate([Controller("/")], AppController);

module.exports.AppController = AppController;
