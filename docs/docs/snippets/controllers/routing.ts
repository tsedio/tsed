import {ServerLoader, ServerSettings} from "@tsed/common";
import {CalendarCtrl} from "./controllers/CalendarCtrl";

@ServerSettings({
  mount: {
    "/rest": `./controllers/*.ts`, // using componentScan
    // Using manual import
    "/manual": [
      CalendarCtrl
    ]
  }
})
export class Server extends ServerLoader {
}
