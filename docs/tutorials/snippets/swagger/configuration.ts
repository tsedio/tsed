import {Configuration} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/swagger"; // import swagger Ts.ED module

@Configuration({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs"
    }
  ]
})
export class Server {
}
