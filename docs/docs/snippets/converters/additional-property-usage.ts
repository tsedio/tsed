import {Configuration} from "@tsed/common";

@Configuration({
  converter: {
    additionalProperties: "error" // default: "error", "accept" | "ignore"
  }
})
export class Server {
}
