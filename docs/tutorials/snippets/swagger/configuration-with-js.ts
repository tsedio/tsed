import {Configuration} from "@tsed/di";
import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  swagger: [
    {
      path: "/api-docs",
      jsPath: "/spec/main.js"
    }
  ]
})
export class Server {}
