import core from "@nestjs/core";
import fastifyPlatform from "@nestjs/platform-fastify";

import {AppModule} from "./nest/app/app.module.js";

core.NestFactory.create(AppModule, new fastifyPlatform.FastifyAdapter(), {
  logger: false,
  bodyParser: false
}).then((app) => app.listen(process.env.PORT || 3000));
