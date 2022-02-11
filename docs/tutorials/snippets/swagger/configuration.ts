import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  rootDir: __dirname,
  swagger: [
    {
      path: "/v2/docs",
      specVersion: "2.0" // by default
    },
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ]
})
export class Server {}
