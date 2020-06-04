import {Configuration} from "@tsed/common";
import {RestCtrl} from "./controllers/RestCtrl";

@Configuration({
  mount: {
    "/": [
      RestCtrl
    ]
  }
})
export class Server {
}
