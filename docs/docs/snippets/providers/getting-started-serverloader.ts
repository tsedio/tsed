import {Configuration} from "@tsed/common";
import {CalendarsCtrl} from "./controllers/CalendarsCtrl";
import {CalendarsService} from "./services/CalendarsService";

@Configuration({
  mount: {
    "/rest": [CalendarsCtrl]
  },
  componentsScan: [
    CalendarsService
  ]
})
export class Server {
}
