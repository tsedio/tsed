import common from "@nestjs/common";
import {__decorate, __metadata} from "tslib";

class AppController {
  root() {
    return {hello: "world"};
  }
}

__decorate(
  [common.Get(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", String)],
  AppController.prototype,
  "root",
  null
);

AppController = __decorate([common.Controller()], AppController);

export {AppController};
//# sourceMappingURL=app.controller.js.map
