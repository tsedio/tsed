"use strict";
import core from "@nestjs/core";

import {AppModule} from "./app/app.module.js";

core.NestFactory.create(AppModule, {
  logger: false,
  bodyParser: false
}).then((app) => app.listen(process.env.PORT || 3000));
