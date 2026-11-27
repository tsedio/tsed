import "@tsed/ajv";

import {Configuration} from "@tsed/di";

import {HelloController} from "./controllers/HelloController.js";
import {OrdersController} from "./controllers/OrdersController.js";
import {UsersController} from "./controllers/UsersController.js";

@Configuration({
  httpPort: Number(process.env.PORT || 8080),
  httpsPort: false,
  disableComponentScan: true,
  logger: {
    level: "off",
    disableRoutesSummary: true,
    disableBootstrapLog: true
  },
  mount: {
    "/": [HelloController, UsersController, OrdersController]
  }
})
export class Server {}
