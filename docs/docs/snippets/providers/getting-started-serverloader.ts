import {Configuration} from "@tsed/common";
import {CalendarsCtrl} from "./controllers/CalendarsCtrl";

@Configuration({
  mount: {
    "/rest": [CalendarsCtrl]
  }
})
export class Server {
}
