import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

@ServerSettings({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs"
    }
  ]
})
export class Server extends ServerLoader {

}
