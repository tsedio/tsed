"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const core_1 = require("@nestjs/core");
const fastify_platform_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("../nest/app/app.module");
const {printMemory} = require("../printMemory");

core_1.NestFactory.create(app_module_1.AppModule, new fastify_platform_1.FastifyAdapter(), {
  logger: false,
  bodyParser: false
})
  .then((app) => app.listen(process.env.PORT || 3000))
  .then(() => {
    printMemory();
  });
//# sourceMappingURL=main.js.map
