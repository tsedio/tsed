import "@tsed/ajv";
import "@tsed/swagger";
import {Configuration} from "@tsed/di";

export const rootDir = import.meta.dirname;

@Configuration({
  logger: {
    level: "off"
  }
})
export class Server {}
