import common_1 from "@nestjs/common";
import {__decorate} from "tslib";

import {AppController} from "./app.controller.js";

class AppModule {}

AppModule = __decorate(
  [
    common_1.Module({
      imports: [],
      controllers: [AppController]
    })
  ],
  AppModule
);

export {AppModule};
