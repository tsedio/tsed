import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  swagger: [
    {
      path: "/v3/docs",
      specVersion: "3.0.1"
    }
  ]
})
export class Server {}
