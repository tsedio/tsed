"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");

core_1.NestFactory.create(app_module_1.AppModule, {
  logger: false,
  bodyParser: false
}).then((app) => app.listen(process.env.PORT || 3000));
//# sourceMappingURL=main.js.map
