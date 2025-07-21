import {Configuration} from "@tsed/di";
import compress from "compression";

import {TimeslotsController} from "./TimeslotsController.js";

@Configuration({
  logger: {
    disableRoutesSummary: true
  },
  mount: {
    "/": [TimeslotsController]
  },
  middlewares: ["cookie-parser", compress({}), "method-override", {use: "json-parser"}, {use: "urlencoded-parser"}]
})
export class Server {}
