import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

@ServerSettings({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs",
      jsPath: "/spec/main.js"
    }
  ]
})
export class Server extends ServerLoader {

}
