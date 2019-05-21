import {ServerLoader, ServerSettings} from "@tsed/common";
import {CalendarsCtrl} from "./controllers/CalendarsCtrl";
import {CalendarsService} from "./services/CalendarsService";

@ServerSettings({
  mount: {
    "/rest": [CalendarsCtrl]
  },
  componentsScan: [
    CalendarsService
  ]
})
export class Server extends ServerLoader {
}
