import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";

import {expressRouter} from "../legacy/server.js"; // import the router from the legacy code

@Configuration({
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    {use: "urlencoded-parser", options: {extended: true}},
    {use: expressRouter, hook: "$beforeRoutesInit"} // add the router here as middleware
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;
}
