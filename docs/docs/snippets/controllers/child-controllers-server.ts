import {Configuration} from "@tsed/di";
import {RestCtrl} from "./controllers/RestCtrl";

@Configuration({
  mount: {
    "/": [RestCtrl]
  }
})
export class Server {}
