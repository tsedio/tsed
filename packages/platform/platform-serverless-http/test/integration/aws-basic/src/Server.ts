import {Configuration} from "@tsed/di";
import {TimeslotsController} from "./TimeslotsController.js";
import compress from "compression";

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
