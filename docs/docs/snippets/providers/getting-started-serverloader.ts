import {Configuration} from "@tsed/di";
import {CalendarsCtrl} from "./controllers/CalendarsCtrl";

@Configuration({
  mount: {
    "/rest": [CalendarsCtrl]
  }
})
export class Server {}
