import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/platform-express";

import {Configuration} from "@tsed/di";
import compress from "compression";

export const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

@Configuration({
  port: 8081,
  logger: {
    level: "info"
  },
  middlewares: ["cookie-parser", compress({}), "method-override", {use: "json-parser"}, {use: "urlencoded-parser"}]
})
export class Server {}
