import "@tsed/ajv";
import "@tsed/swagger";
import {Configuration} from "@tsed/di";

export const rootDir = import.meta.dirname;

@Configuration({
  statics: {
    "/": `${rootDir}/public`
  },
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  logger: {
    level: "off"
  }
})
export class Server {}
