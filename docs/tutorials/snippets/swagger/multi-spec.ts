import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/swagger"; // import swagger Ts.ED module

@ServerSettings({
  rootDir: __dirname,
  swagger: [
    {
      path: "/api-docs-v1",
      doc: "api-v1"
    },
    {
      path: "/api-docs-v2",
      doc: "api-v2"
    }
  ]
})
export class Server extends ServerLoader {

}
