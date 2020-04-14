import {ServerLoader, ServerSettings} from "@tsed/common";

@ServerSettings({
  converter: {
    additionalProperties: "error" // default: "error", "accept" | "ignore"
  }
})
export class Server extends ServerLoader {

}
